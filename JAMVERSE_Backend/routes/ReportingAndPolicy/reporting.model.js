const mongoose = require("mongoose");

const reportingModel = mongoose.Schema({
    user_id: {
        type: String
    },
    name: {
        type: String
    },
    id: {
        type: String
    },
    post_id: {
        type: String
    }
}, { timestamps: true });

reportingModel.index({ user_id: 1 });


const reportModel = mongoose.model('reportModel', reportingModel);

const RequestingDataModel = mongoose.Schema({
    user_id: {
        type: String
    },
    status: {
        type: String,
        default: 'pending'
    },
}, { timestamps: true });

RequestingDataModel.index({ user_id: 1 });


const requestReportModel = mongoose.model('RequestingDataModel', RequestingDataModel);


class ReportingModel {
    async create({user_id, name, id, post_id}) {
        return new reportModel({user_id, name, id, post_id}).save();
    }

    async addReport({ _id }) {
        return new requestReportModel({user_id: _id}).save();
    }
}

module.exports = new ReportingModel;