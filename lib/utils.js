'use strict'

const fs = require('fs')
const request = require('request')

module.exports =
class Utils {
  static download (url, destination) {
    return new Promise((resolve, reject) => {
      request
        .get(url)
        .on('error', (error) => {
          reject(error)
          return
        })
        .on('end', () => {
          resolve()
          return
        })
        .pipe(
          fs.createWriteStream(destination)
            .on('error', (error) => {
              reject(error)
              return
            })
          )
    })
  }

  static isDirectory (somePath) {
    return fs.lstatSync(somePath).isDirectory()
  }
}
