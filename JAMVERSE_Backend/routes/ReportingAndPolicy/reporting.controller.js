const reportingModel = require("./reporting.model");


class ReportingController {
    async addReport(req, res, next) {
        try {
            let { _id: user_id } = req.decoded;
            let { post_id, name, id } = req.body;
            const report = await reportingModel.create({user_id, name, id, post_id});
            return res.status(200).json({ message : "Success"});
        } catch (err) {
            return next(err);
        }
    }

    async requestInformation(req, res, next) {
        try {
            let { _id: user_id } = req.decoded;
            const report = await reportingModel.addReport({ _id: user_id });
            return res.status(200).json({ message : "Success"});
        } catch (err) {
            return next(err);
        }
    }
}

module.exports = new ReportingController;