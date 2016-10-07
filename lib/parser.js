'use strict'

const htmlparser = require('htmlparser2')
const Utils = require('./utils')

module.exports =
class Parser {
  constructor(url) {
    this._url = url
    this._src

    const self = this

    this._parser = new htmlparser.Parser({
      onopentag(tag, attribs) {
        if (tag === 'source' && attribs.type === 'video/mp4') {
          self._src = attribs.src
        }
      }
    }, { decodeEntities: true })
  }

  getGifSrc() {
    const self = this

    return new Promise((resolve, reject) => {
      Utils.callUrl({
        url: self._url,
        onData(chunk) {
          self._parser.write(chunk)
        },
        onEnd() {
          self._parser.end()
          resolve(self._src)
        },
        onError(err) {
          reject(err)
        }
      })
    })
  }
}
