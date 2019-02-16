module.exports = {
	"chrome-gui-test": "--tags @desktop --world-parameters " + JSON.stringify({ platform: "chrome-desktop-test", width: 1070, height: 1180 }),
	"chrome-api-test": "--tags @api2-Done --world-parameters " + JSON.stringify({ platform: "chrome-desktop-test", width: 1070, height: 1180 })
// tags defined here, creates a world for each scenario (page obj, support, step definition - creates a separate
//driver instance for each scenario)
//stringify is used to convert json objects into string or text format.

};
