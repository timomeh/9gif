'use strict'

const http = require('http')
const fs = require('fs')
const request = require('request')

module.exports =
class Utils {
  static callUrl({ url, onData, onEnd, onError }) {
    http.get(url, res => {
      res.setEncoding('utf8')
      res.on('data', onData)
      res.on('end', onEnd)
    }).on('error', onError)
  }

  static download (uri, filename) {
    request(uri).pipe(fs.createWriteStream(filename))
  }

  static get apikey() {
    return 'dc6zaTOxFJmzC'
  }
}
