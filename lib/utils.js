'use strict'

const fs = require('fs')
const request = require('request')

/**
 * Utilities
 */
module.exports =
class Utils {

  /**
   * Download a http file to a local destination
   *
   * @param {String} url HTTP URL
   * @param {String} destination local file-path
   * @returns {Promise}  A Proimse resolved when the file was downloaded
   */
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

  /**
   * Check if a local path is a directory
   *
   * @retuns {Boolean}
   */
  static isDirectory (somePath) {
    return fs.lstatSync(somePath).isDirectory()
  }
}
