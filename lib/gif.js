'use strict'

const fs = require('fs')
const path = require('path')
const url = require('url')
const request = require('request')
const Utils = require('./utils')

module.exports =
class Gif {
  constructor(src, sourceUrl, dest) {
    this._src = src
    this._dest = dest
    this._sourceUrl = sourceUrl
  }

  convertVideo() {
    return this._upload()
    .then(this._request)
    .then(this._save.bind(this))
  }

  _save(gifUrl) {
    if (fs.lstatSync(this._dest).isDirectory()) {
      this._saveInDirectory(gifUrl)
    } else {
      this._writeFile(gifUrl)
    }
  }

  _saveInDirectory(gifUrl) {
    const realDest = path.resolve(this._dest, `giphy${Date.now()}.gif`)
    return this._writeFile(realDest, gifUrl)
  }

  _writeFile(absoluteFilePath, gifUrl) {
    const file = fs.createWriteStream(absoluteFilePath)
    Utils.download(gifUrl, absoluteFilePath)
  }

  _upload() {
    const form = {
      'source_image_url': this._src,
      'source_post_url': this._sourceUrl,
      'api_key': Utils.apikey
    }

    return new Promise((resolve, reject) => {
      request.post('http://upload.giphy.com/v1/gifs', { form }, (err, res, body) => {
        if (err) {
          return reject(err)
        }

        const json = JSON.parse(body)
        resolve(json.data.id)
      })
    })
  }

  _request(giphyId) {
    const self = this

    return new Promise((resolve, reject) => {
      let body = ''

      Utils.callUrl({
        url: `http://api.giphy.com/v1/gifs/${giphyId}?api_key=${Utils.apikey}`,
        onData(chunk) {
          body += chunk
        },
        onEnd() {
          const json = JSON.parse(body)
          return resolve(json.data.images.original.url)
        },
        onError(err) {
          reject(err)
        }
      })
    })
  }
}
