const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
});


class fileUpload {
    async upload(files, name, bucketName, isMain) {
        console.log(files.length)
        let responseData = [];
        const d = new Date();
        files.map(async item => {
            let params = {
                Bucket: bucketName || process.env.AWS_BUCKET_NAME,
                Key: isMain ? name : name + item.originalname,
                Body: item.buffer,
                ACL: 'public-read'
            }
            await s3.upload(params, (error, data) => {
                if (error) {
                    responseData.push(error);
                    if (files?.length == responseData.length) {
                        return responseData;
                    }
                } else {
                    responseData.push(data);
                    if (files?.length == responseData.length) {
                        return responseData;
                    }
                }
            });
        })
    }

    async uploadBloggger(file, fileName, destination,) {
        const params = {
            Bucket: destination,
            Key: fileName,
            Body: file,
            ACL: 'public-read'
        };

        s3.upload(params, (err, data) => {
            if (err) {
                console.error('Error uploading file to S3:', err);
            } else {
                console.log('File uploaded successfully. Object URL:', data.Location);
            }
        });
    }

}

module.exports = new fileUpload;