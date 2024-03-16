const Quote = require('quoters').default;
const moment = require('moment');
const _ = require('underscore');
const { default: mongoose } = require('mongoose');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const defaultData = require("./defaultData.json");
const defaultFont = require("./defaultFont.json");
const postModel = require("../../schema/post.schema");
const postGroupModel = require("../../schema/postGroup.schema");
const userGroupModel = require("../../schema/users.schema");
const blogModel = require("../../schema/blogs.schema");

const template = require('./template');
const fileUpload = require('../../utils/helpers/fileUpload');

let tempLink = 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg';

class postCreateController {
    async create() {
        try {

            let postDatas = await postGroupModel.find({ is_done: { $ne: true }, "second_line_details.created_by": { $exists: true }, "third_line_details.created_by": { $exists: true } }).skip(0).limit(30);

            for (const postData of postDatas) {
                let firstUserData = await userGroupModel.findOne({ _id: mongoose.Types.ObjectId(postData.created_by) }, { personalImage: 1, full_name: 1 })
                let secondUserData = await userGroupModel.findOne({ _id: mongoose.Types.ObjectId(postData.second_line_details.created_by) }, { personalImage: 1, full_name: 1 })
                let thirdUserData = await userGroupModel.findOne({ _id: mongoose.Types.ObjectId(postData.third_line_details.created_by) }, { personalImage: 1, full_name: 1 })

                if(!firstUserData || !secondUserData || !thirdUserData){
                    postData.is_done = true;
                    await postData.save();
                    continue;
                }

                let HTMLtemplate = template({ userPofileImage1: firstUserData?.personalImage?.pI1 || tempLink, userPofileImage2: secondUserData?.personalImage?.pI1 || tempLink, userPofileImage3: thirdUserData?.personalImage?.pI1 || tempLink, userText1: postData.first_line_text, userText2: postData.second_line_details.second_line_text, userText3: postData.third_line_details.third_line_text, userFullName1:  firstUserData.full_name, userFullName2:  secondUserData.full_name, userFullName3:  thirdUserData.full_name,});
                const outputFilePath = path.join(__dirname, 'output.png');

                await convertElementToImage(HTMLtemplate, "card-image-png", outputFilePath);

                let fileName = `${Date.now()}.png`;

                await fileUpload.uploadBloggger(fs.createReadStream(outputFilePath), fileName, `${process.env.AWS_BUCKET_NAME}/blog`);
                let fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.us-east-1.amazonaws.com/blog/${fileName}`;

                await new blogModel({image: fileUrl, text: `${postData.first_line_text} ${postData.second_line_details.second_line_text} ${postData.third_line_details.third_line_text}`}).save();

                postData.is_done = true;
                await postData.save();
            }

        } catch (error) {
            console.log(error)
        }
        console.log("========================= Completed ============================");
        return true;
    }

    async deleteSimilarPost() {
        console.log("Delete Crons Started !!!!!!!!!!!!!!!!")
        try {
            let postData = await postGroupModel.find({}).sort({ createAt: -1 }).skip(0).limit(1500);
            let toRemoveIds = [];
            let acc = [];
            for (const item of postData) {
                let res = acc?.filter(i =>
                    i?.second_line_details?.second_line_text === item?.second_line_details?.second_line_text
                    &&
                    i?.third_line_details?.third_line_text === item?.third_line_details?.third_line_text
                    &&
                    i?.first_line_text === item?.first_line_text
                )
                if (res.length === 0) {
                    acc.push(item);
                }
                else toRemoveIds.push(item)
            }


            toRemoveIds = toRemoveIds.map(i => i?._id?.toString());
            toRemoveIds = Array.from(new Set(toRemoveIds));
            toRemoveIds = toRemoveIds.map(i => mongoose.Types.ObjectId(i))

            let response = await postGroupModel.find({ _id: { $in: toRemoveIds } }).deleteMany();
            console.log({ response });
            console.log("Crons Complete");
            return true;
        } catch (error) {
            console.log("error in cronjobs", error.message)
            return true;
        }
    }
}

module.exports = new postCreateController;



async function convertElementToImage(htmlString, elementId, outputPath) {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser'
    });
    const page = await browser.newPage();

    await page.setContent(htmlString);
    const elementHandle = await page.$(`#${elementId}`);
    if (elementHandle) {
        await elementHandle.screenshot({ path: outputPath });
    } else {
        console.error(`Element with ID '${elementId}' not found.`);
    }

    await browser.close();
}
