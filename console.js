this.window.consoleLog = [];

(function () {
	const oldLog = console.log;
	console.log = function () {
		const args = Array.prototype.slice.call(arguments);
		args.unshift(new Date().getTime())
		this.window.consoleLog.push(args);
		if (this.window.consoleLog.length > 200) {
			this.window.consoleLog.shift();
		}
		oldLog.apply(console, arguments);
	};
})();

// TODO: Pretty print objects / arrays etc.
this.window.getConsoleLog = function () {
	return consoleLog.map(function (logLine) {
		return logLine.join(" ");
	});
}
