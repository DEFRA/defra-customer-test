var downloader = require('..')

const urlPattern = 'https://map.mfgi.hu/bp50/pdf/[n].pdf'
const from = 1
const to = 2

downloader.start(urlPattern, from, to)
