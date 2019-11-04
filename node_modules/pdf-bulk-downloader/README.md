## Goal
This is a library which downloads multiple PDF files from a site when they have the same url pattern with a one-by-one incremented number. The library replaces manual one-by-one downloading of the files with one simple API call.

## Usage of the API
#### PDFs to download:
* https://any.host/pdfs/text1.pdf
* https://any.host/pdfs/text2.pdf
* ...
* https://any.host/pdfs/text12.pdf

#### Expected results (locally downloaded files in your ``out`` directory):
* text01.pdf
* text02.pdf
* ...
* text12.pdf

#### How to call it:

```
var downloader = require('pdf-bulk-downloader')

const urlPattern = 'https://any.host/pdfs/text[n].pdf'
const from = 1
const to = 12

downloader.start(urlPattern, from, to)
```

- configure ``urlPattern``, ``from``, ``to``
- keep ``[n]`` as is: it is a placeholder recognized by the application, which is replaced by the numbers from ``from`` to ``to`` incremented by 1.

## Installation
```
npm install pdf-bulk-downloader --save-dev
```

## Examples
See a typical usage in ``download-pdfs.js``:
```
$ git clone https://github.com/labudao/pdf-bulk-downloader.git --depth 1
$ cd pdf-bulk-downloader
$ npm install
$ npm run test
```
