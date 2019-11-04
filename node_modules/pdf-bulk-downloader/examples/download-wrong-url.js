var downloader = require('..')

const urlPattern = 'https://nonexisting/but/valid/url/[n].pdf'
const from = 1
const to = 2

downloader.start(urlPattern, from, to)
