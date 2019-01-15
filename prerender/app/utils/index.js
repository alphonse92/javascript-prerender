import fs from 'fs'


const dirty_chars = [
  "\n",
  "\'",
  "\"",
  "\&",
  "\r",
  "\t",
  "\b",
  "\f",
]

const hasADirtyChar = (str) => dirty_chars.reduce((hasOne, dirtyChar) => hasOne || str.indexOf(dirtyChar), false)

export const cleanString = (str) => str
  .replace(/\\n/g, "\\n")
  .replace(/\\'/g, "\\'")
  .replace(/\\"/g, '\\"')
  .replace(/\\&/g, "\\&")
  .replace(/\\r/g, "\\r")
  .replace(/\\t/g, "\\t")
  .replace(/\\b/g, "\\b")
  .replace(/\\f/g, "\\f");

export function cleanHeaders(headers) {
  Object
    .keys(headers)
    .forEach((header) => {
      const value = headers[header]
      if (hasADirtyChar(value)) headers[header] = cleanString(JSON.stringify(value))
    })
  return headers
}

export function isContentTypeImage(headers) {
  return !!headers && headers["content-type"] && headers["content-type"].indexOf("image/") >= 0
}

export function saveFile(path, data) {
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(path);
    writer.end(data);
    writer.on('finish', function (fd) {
      resolve({ path, data });
    });
    writer.on("error", (err) => reject(err))
  })
}


export function debug() {
  if (true)
    console.log(...arguments);
}