
const { generateAccessToken } = require("../../utils/helpers/jwt.service");
const { encrypt, decrypt } = require("../../utils/helpers/password.crypto");

const settingModel = require("./setting.model");

class settingController {
    async changePassword(req, res) {
        try {
            let {password, new_password} = req.body;
            let userPassword = (decrypt(req.decoded.password, process.env.CRYPTO_PASSWORD));
            if (userPassword.decoded != password) return res.status(401).json({ message: "Wrong Password" });

            password = (encrypt(new_password, process.env.CRYPTO_PASSWORD)).encoded;
            await settingModel.updatePassword(req.decoded.email, password);
            return res.json({ message: "Password Updated Successfully" });
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
    async getMe (req, res) {
        let {_id} = req.decoded;
        try {
            let userData = await settingModel.findUserData(_id);
            let postCount = await settingModel.findUserPostCount(_id);
            const prop = {
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
            let token = await generateAccessToken(prop);

            return res.json({code: 200, userData: prop, token: token, error: null, message: "Success"});
        } catch (error) {
            return res.json({code: 500, data: null, error: error.message});
        }
    }

    async checkNotificationStatus(req, res) {
        try {
            let { _id } = req.decoded;
            let userData = await settingModel.getNotificationStatus(_id);
            return res.json({code: 200, data: userData, error: null, message: "Success"})
        } catch (error) {
            return res.json({ code: 500, data: null, error: error.message });
        }

    }

    async updatedNotification(req, res) {
        try {
            let { _id } = req.decoded;
            let status = req.body.status;
            await settingModel.updateNotificationStatus(_id, status);
            return res.json({ code: 200, data: null, error: null, message: "Success" })
        } catch (error) {
            return res.json({ code: 500, data: null, error: error.message });
        }
    }
}

module.exports = new settingController;