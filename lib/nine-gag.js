'use strict'

const htmlparser = require('htmlparser2')
const request = require('request')

/**
 * Class handling everything related to 9GAG
 */
module.exports =
class NineGag {
  constructor ({ url }) {
    this.member = {
      url,
      mp4Url: undefined
    }
  }

  /**
   * Fetch 9GAG Page and parse for 'src' Attribute in <source type="video/mp4">
   *
   * @returns {Promise}  A Promise resolved with the src of the mp4
   */
  parse () {
    const _this = this

    const parser = new htmlparser.Parser({
      onopentag (name, attribs) {
        if (name === 'source' && attribs.type === 'video/mp4') {
          _this.member.mp4Url = attribs.src
        }
      }
    }, { decodeEntities: true })

    return new Promise((resolve, reject) => {
      request(this.member.url)
        .on('response', response => {
          if (response.statusCode !== 200) reject(new Error('Call Not OK'))
        })
        .on('error', error => {
          reject(error)
        })
        .on('end', () => {
          parser.end()

          // We can't trust that the parser found a mp4 url
          if (this.member.mp4Url == null) {
            reject(new Error('No mp4 URL found'))
            return
          }

          resolve(this.member.mp4Url)
        })
        .on('data', chunk => {
          // Stream received body chunk to parser
          parser.write(chunk)
        })
    })
  }
}
