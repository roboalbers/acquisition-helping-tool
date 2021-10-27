const express = require("express");
const fs = require('fs');
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');
const dbPath = './server/db/jobs.json';
const PORT = 5000;
var corsOptions = {
	origin: "http://localhost:3000"
};


const app = express();

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
	fs.readFile(dbPath, (err, data) => {
		if (err) throw err;
		const parsedData = JSON.parse(data);
		res.json(parsedData.jobs);
	});
});

app.post("/jobs", (req, res) => {
	const cities = req.body;
	fs.readFile(dbPath, (err, data) => {
		if (err) throw err;
		const parsedData = JSON.parse(data);
		const filteredJobs = [];
		if (cities.length > 0) {
			for (var i = 0; i < parsedData.jobs.length; i++) {
				if (parsedData.jobs[i].location.some(city => cities.includes(city))) {
					filteredJobs.push(parsedData.jobs[i]);
				}
			}
			res.json(filteredJobs);
		} else {
			res.json(parsedData.jobs);
		}
	});
});

app.post("/add-job", (req, res) => {
	const job = req.body;
	req.body.id = uuidv4();
	fs.readFile(dbPath, (err, data) => {
		if (err) throw err;
		const parsedData = JSON.parse(data);
		parsedData.jobs.push(job);
		fs.writeFile(dbPath, JSON.stringify(parsedData), function (err) {
			if (err) throw err;
			res.json(job);
		});
	});
});

app.delete("/job/:guid", (req, res) => {
	const { guid } = req.params;
	fs.readFile(dbPath, (err, data) => {
		if (err) throw err;
		const parsedData = JSON.parse(data);
		const requestedGuid = parsedData.jobs.findIndex(job => job.id === guid);
		parsedData.jobs.splice(requestedGuid, 1);
		fs.writeFile(dbPath, JSON.stringify(parsedData), function (err) {
			if (err) throw err;
			res.json(parsedData);
		});
	});
});