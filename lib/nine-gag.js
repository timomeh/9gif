'use strict'

const htmlparser = require('htmlparser2')
const request = require('request')

module.exports =
class NineGag {
  constructor ({ url }) {
    this.member = {
      url,
      mp4Url: undefined
    }
  }

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
          if (this.member.mp4Url == null) {
            reject(new Error('No mp4 URL found'))
            return
          }

          resolve(this.member.mp4Url)
        })
        .on('data', chunk => {
          parser.write(chunk)
        })
    })
  }
}
