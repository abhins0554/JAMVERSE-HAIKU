const ResumeParser = require('easy-resume-parser');

// From file
// const resume = new ResumeParser("./files/resume.doc");


// From URL
class TestController {
    static async getParser(req, res) {
        try {
            let link = req.body.link;
            if (!link) return res.status(500).json({ error: 'Link not found' })
            const resume = new ResumeParser(link);

            //Convert to JSON Object
            let data = await resume.parseToJSON();
            return res.status(200).json({data});
        }
        catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
}
module.exports = TestController;