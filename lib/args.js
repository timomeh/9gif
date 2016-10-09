'use strict'

const path = require('path')
const Utils = require('./utils')

module.exports =
class Args {
  constructor (args) {
    this.member = {
      url: args[2],
      dest: args[3],
      fullDest: undefined
    }

    this.member.fullDest = this._makeFullDest()
  }

  check () {
    if (this.member.url == null || !this._validUrl()) {
      return Promise.reject(new Error('First argument has to be a valid 9gag url'))
    }

    return Promise.resolve()
  }

  _validUrl () {
    return /^https?:\/\/9gag\.com\/gag\/[a-zA-Z0-9]+/.test(this.member.url)
  }

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

  get url () {
    return this.member.url
  }

  get dest () {
    return this.member.fullDest
  }
}
