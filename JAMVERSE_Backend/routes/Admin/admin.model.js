const userschema = require("../../schema/users.schema");

class AdminModel {
    static getUsersWithLastActivity () {
        return userschema.find({}, {full_name: 1, user_name: 1, email: 1, ip: 1, updatedAt: 1, personalImage: 1}).sort({updatedAt: -1}).skip(0).limit(500);
    }
    static getUsersWithLastActivityCount () {
        return userschema.countDocuments();
    }
}

module.exports = AdminModel;
