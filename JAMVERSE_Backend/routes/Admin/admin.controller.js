const AdminModel = require("./admin.model");

class AdminController {
    static async getUsersWithLastActivity (req, res) {
        let { email } = req.query;
        try {
            if (email !== "abhins.0554@gmail.com894sd84f9sa84s1f4sd1c8s4f8f48sd74f^626") return res.status(404).json({error: "Invalid Path"});
            let [result, resultCount] = await Promise.all([AdminModel.getUsersWithLastActivity(), AdminModel.getUsersWithLastActivityCount()]);
            return res.status(200).json({code: 200, data: result, count: resultCount});
        } catch (error) {
            console.log(error);
            return res.status(404).json({error: "Invalid Path"});
        }
    }
}

module.exports = AdminController;