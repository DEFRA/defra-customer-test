const fs = require("fs");

module.exports.base64EncodeCrx = (file) => {
	const stream = fs.readFileSync(file);
	return new Buffer(stream).toString("base64");
};
