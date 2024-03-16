const admin = require("firebase-admin");
const underscore = require('underscore');

const authModel = require("./auth.model");

const { encrypt, decrypt } = require("../../utils/helpers/password.crypto");

const { generateAccessToken } = require("../../utils/helpers/jwt.service");
const transporter = require("../../mail/Mailer.Services");

const forgotPasswordText = require("../../mail/template/forgotPassword");
const { generateOTP } = require("../../utils/helpers/Common.helper");


class chatController {
    async loginUser(req, res, next) {
        try {
            let { email, password, ip } = req.body;
            ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
            let userData = await authModel.getUserFromEmail(email);
            if (userData.length === 0) return res.status(401).json({ message: "User not found" });
            let userPassword = (decrypt(userData[0].password, process.env.CRYPTO_PASSWORD));

            if (userPassword.decoded != password) return res.status(401).json({ message: "Wrong Password" });
            await authModel.updateIp(userData[0]._id, ip);
            if (!userData[0]?.is_verify) return res.status(201).json({ message: "Verification Required", });
            let postCount = await authModel.findUserPostCount(userData[0]._id);
            let prop = {
                full_name: userData[0].full_name,
                user_name: userData[0].user_name,
                email: userData[0].email,
                isBlocked: userData[0].isBlocked,
                isDeleted: userData[0].isDeleted,
                personalImage: userData[0].personalImage,
                about: userData[0].about,
                _id: userData[0]._id,
                followers: userData[0].followers.length,
                following: userData[0].following.length,
                postCount: postCount
            }
            if(prop._id.toString() === '65337aa6dc6f6c29e24d26ce') return res.status(400).json({ message: "You have been blocked from JamVerse" });
            let token = await generateAccessToken(prop);
            return res.status(200).json({ message: "Login Successfully", token: token, userData: prop });
        }
        catch (err) {
            console.log(err);
            return res.status(400).json({ error: "Error Delete Failed", message: err.message })
        }
    }


    async signInUser(req, res, next) {
        try {
            let { email, password, full_name, user_name, mobile, login_type, ip } = req.body;
            ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
            let userData = await authModel.getUserFromEmail(email);
            if (userData.length !== 0) return res.status(401).json({ message: "User already exist" });
            userData = await authModel.getUserFromUserName(user_name);

            if (userData.length !== 0) return res.status(401).json({ message: "Username already exist" });
            password = (encrypt(password, process.env.CRYPTO_PASSWORD)).encoded;

            const userId = await authModel.createUser(email, password, full_name, user_name, mobile, login_type, ip);
            let otp = generateOTP();
            let forgotPasswordTemplate = forgotPasswordText({
                ip: req.header('x-forwarded-for') || req.socket.remoteAddress, 
                password: otp, 
                product_name: process.env.PRODUCT_NAME,
                user_name: full_name,
            })
            await transporter.sendMail({
                from: process.env.MAILER_USER,
                to: email,
                bcc: [process.env.MAILER_USER],
                subject: `Welcome: Your OTP for ${process.env.PRODUCT_NAME}`,
                html: forgotPasswordTemplate
            }).then(resp => {
                console.log(resp)
            })
            .catch(err => {
                console.log(err);
            })
            await authModel.findByIdandUpdateOTP(userId._id, otp)
            return res.status(200).json({ message: "OTP has been send to your mail please validate", });
        }
        catch (err) {
            return res.status(401).json({ error: "Error Delete Failed", message: err.message })
        }
    }

    async loginUserGoogle(req, res) {
        try {
            let { email } = req.decoded;
            let { ip } = req.body;
            ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
            let userData = await authModel.getUserFromEmail(email);
            if (userData.length === 0) return res.status(401).json({ message: "User not found" });

            let userPassword = (decrypt(userData[0].password, process.env.CRYPTO_PASSWORD)).decoded;
            userPassword = userPassword.split('').map((i, index) => i.charCodeAt(0));

            await authModel.updateIp(userData[0]._id, ip);
            if (!userData[0]?.is_verify) return res.status(201).json({ message: "Verification Required", });
            let postCount = await authModel.findUserPostCount(userData[0]._id);
            let prop = {
                full_name: userData[0].full_name,
                user_name: userData[0].user_name,
                email: userData[0].email,
                isBlocked: userData[0].isBlocked,
                isDeleted: userData[0].isDeleted,
                personalImage: userData[0].personalImage,
                about: userData[0].about,
                _id: userData[0]._id,
                followers: userData[0].followers.length,
                following: userData[0].following.length,
                postCount: postCount,
                profile: userPassword
            }
            let token = await generateAccessToken(prop);

            return res.status(200).json({ message: "Login Successfully", token: token, userData: prop });
        } catch (error) {
            return res.status(401).json({ error: "Error while login", message: error.message });
        }
    }


    async signInUserGoogle(req, res) {
        try {
            let { email, name: full_name, picture, email_verified, login_type = "google", ip= "", mobile = "" } = req.decoded;
            ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
            let user_name = `${generateOTP()}JAMVERSE${generateOTP()}${generateOTP()}`;
            let password = `${generateOTP()}${generateOTP()}125`;
            let profile = password.split('').map((i, index) => i.charCodeAt(0))

            let userData = await authModel.getUserFromEmail(email);
            if (userData.length !== 0) return res.status(401).json({ message: "User already exist" });
            userData = await authModel.getUserFromUserName(user_name);

            if (userData.length !== 0) return res.status(401).json({ message: "Username already exist" });
            password = (encrypt(password, process.env.CRYPTO_PASSWORD)).encoded;

            const userId = await authModel.createUser(email, password, full_name, user_name, mobile, login_type, ip, email_verified);

            return res.status(200).json({ message: "Success", data: {userId, profile} });
        }
        catch (err) {
            return res.status(401).json({ error: "Error Delete Failed", message: err.message })
        }
    }

    async forgotPassword(req, res) {
        try {
            let { email } = req.query;
            let [userData] = await authModel.getUserFromEmail(email);
            if (!userData) return res.status(401).json({ message: "User not found" });

            let otp = generateOTP();
            let forgotPasswordTemplate = forgotPasswordText({
                ip: req.ip, 
                password: otp, 
                product_name: process.env.PRODUCT_NAME,
                user_name: userData.full_name,
            })
            await transporter.sendMail({
                from: process.env.MAILER_USER,
                to: userData.email,
                bcc: [process.env.MAILER_USER],
                subject: `Password Reset: Your OTP for ${process.env.PRODUCT_NAME}`,
                html: forgotPasswordTemplate
            })
            .then(resp => {
                console.log(resp)
            })
            .catch(err => {
                console.log(err);
            })
            await authModel.findByIdandUpdateOTP(userData._id, otp)

            return res.status(200).json({ message: "OTP has been sent", })
        }
        catch (error) {
            return res.status(401).json({ message: error.message, })
        }
    }

    async validateOtpPassword(req, res) {
        try {
            let { email, otp, password } = req.query;
            let [userData] = await authModel.getUserFromEmail(email);
            if (!userData) return res.status(401).json({ message: "User not found" });
            if(userData.otp !== +otp) return res.status(401).json({ message: "Invalid OTP" });
            password = (encrypt(password, process.env.CRYPTO_PASSWORD)).encoded;
            await authModel.updatePassword(email, password);
            await authModel.findByIdandUpdateOTP(userData._id, 19519515, true)
            return res.status(200).json({ message: "Password Reset Successfully", })
        }
        catch (error) {
            return res.status(401).json({ message: error.message, })
        }
    }

}

module.exports = new chatController;
