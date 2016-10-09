'use strict'

const path = require('path')
const Utils = require('./utils')

/**
 * Argument helpers
 */
module.exports =
class Args {
  constructor (args) {
    this.member = {
      url: args[2],
      dest: args[3],
      fullDest: undefined
    }

    // fullDest is a full path to a file. The member variable `dest`
    // could be empty, a path to a directory or a path to a file
    this.member.fullDest = this._makeFullDest()
  }

  /**
   * Checks arguments for validity
   *
   * @returns {Promise}  A Promise resolved when the arguments are valid
   */
  check () {
    if (this.member.url == null || !this._validUrl()) {
      return Promise.reject(new Error('First argument has to be a valid 9gag url'))
    }

    return Promise.resolve()
  }

  /**
   * Checks if a url is a valid 9GAG url
   *
   * @returns {Boolean}
   */
  _validUrl () {
    return /^https?:\/\/9gag\.com\/gag\/[a-zA-Z0-9]+/.test(this.member.url)
  }

  /**
   * Generate a full file-path to the destination, to which the gif will be
   * downloaded
   *
   * @returns {Promise}  A Promise resolved with the full file-path
   */
  _makeFullDest () {
    const { dest } = this.member

    function makeFilePath (dirPath) {
      return path.resolve(dirPath, `giphy${Date.now()}.gif`)
    }

    if (dest) {
      let fullDest = path.resolve(dest)
      if (Utils.isDirectory(fullDest)) {
        return makeFilePath(fullDest)
      }

      return fullDest
    }

    return makeFilePath(process.cwd())
  }

  /**
   * Get the 9GAG url
   *
   * @return {String}  URL to 9GAG page
   */
  get url () {
    return this.member.url
  }

  /**
   * Get the file-path of the destination
   *
   * @return {String}  Full file-path
   */
  get dest () {
    return this.member.fullDest
  }
}
