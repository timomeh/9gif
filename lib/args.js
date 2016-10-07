'use strict'

const path = require('path')

module.exports =
class Args {
  constructor(args) {
    this._args = args
    this._url = args[2]
    this._dest = args[3]
    this._fullDest = this._makeFullDest()

    this._check()
  }

  _check() {
    if (this._url == null || !this._validUrl()) {
      throw 'First argument has to be a valid 9gag url'
    }
  }

  _validUrl() {
    return /^https?:\/\/9gag\.com\/gag\/[a-zA-Z0-9]+/.test(this._url)
  }

  _makeFullDest() {
    if (this._dest) {
      return path.resolve(this._dest)
    }

    return process.cwd()
  }

  get url() {
    return this._url
  }

  get dest() {
    return this._fullDest
  }
}
