var https = require('https');
var fs = require('fs');

const url = (urlPattern, n) => urlPattern.replace('[n]', n)
const dir = 'out\\';

const download = (urlPattern, n) => {
  const leadingZero = n < 10 ? '0' : '';
  const fileName = dir + leadingZero + n + '.pdf';
  const wstream = fs.createWriteStream(fileName);
  const finalUrl = url(urlPattern, n);
  https.get(finalUrl, (res) => {
      if (res.statusCode !== 200) {
        wstream.end();
        throw new Error('request failed with error ' + `${res.statusCode}`);
      }
      res.on('data', function(data) {
        wstream.write(data);
      }).on('end', function() {
        console.log(finalUrl + ' completed');
        wstream.end();
      }).on('error', function() {
        console.log('error during ' + n, res.statusCode);
        wstream.end();
    });
  })
	.on('error', (e) => {
		console.error(e.code === 'ENOTFOUND' ? 'url not found: ' + finalUrl : 'unexpected error: ' + e.code);
		fs.unlink(fileName, (error) => {
			if (error) {
				console.log('error during deleting file', fileName, error);
			}
		});
	});
}

const validate = (urlPattern, from, to) => {
  if (!urlPattern.startsWith('https://')) {
    throw new Error('url must start with https://')
  }
  if (!urlPattern.endsWith('.pdf')) {
    throw new Error('url must end with .pdf')
  }
  if (from > to) {
    throw new Error('from must be greater than to')
  }
}

const prepareOutputDir = (dir) => {
	try {
		let files = fs.readdirSync(dir)
		if (files.length > 0) {
			throw new Error('not empty dir: ' + dir);
		}
	}
	catch (error) {
		if (error.code === 'ENOENT') {
			fs.mkdirSync(dir);
			console.log('dir created: ', dir);
		}
		else {
			throw error;
		}
	}
}

const start = (urlPattern, from, to) => {
  validate(urlPattern, from, to)
	prepareOutputDir(dir)
	
	for (let i = from; i <= to; i++) {
		download(urlPattern, i);
	}
}

exports.start = start
