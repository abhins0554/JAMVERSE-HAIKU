const CronJob = require('cron').CronJob;

const postCreateController = require("./postCreate/index")

const PostCreateJob = new CronJob(
	'* * * * *',
	postCreateController.create,
	null,
	true,
	'Asia/Kolkata'
);

PostCreateJob.stop();

const PostDeleteSimilar = new CronJob(
	'* * * * *',
	postCreateController.deleteSimilarPost,
	null,
	true,
	'Asia/Kolkata'
);
PostDeleteSimilar.stop();
