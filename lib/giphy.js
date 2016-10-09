'use strict'

const request = require('request')

module.exports =
class Giphy {
  constructor ({ mp4Url, source }) {
    this.apiKey = 'dc6zaTOxFJmzC'

    this.member = {
      mp4Url,
      source
    }
  }

  generate () {
    return Promise.resolve()
    .then(() => { return this._uploadVideo() })
    .then(id => { return this._getGifUrl(id) })
  }

  _uploadVideo () {
    const form = this._body({
      source_image_url: this.member.mp4Url,
      source_post_url: this.member.source
    })

    return new Promise((resolve, reject) => {
      request.post('http://upload.giphy.com/v1/gifs', { form },
      (error, response, body) => {
        if (error) {
          reject(error)
          return
        }

        if (response.statusCode === 403) {
          reject(new Error('Upload Client Error'))
          return
        }

        if (response.statusCode !== 200) {
          reject(new Error('Misc Connection Error'))
          return
        }

        const json = JSON.parse(body)

        resolve(json.data.id)
      })
    })
  }

  _getGifUrl (id) {
    return new Promise((resolve, reject) => {
      request(`http://api.giphy.com/v1/gifs/${id}?api_key=${this.apiKey}`,
      (error, response, body) => {
        if (error) {
          reject(error)
          return
        }

        if (response.statusCode === 403) {
          reject(new Error('Fetch Client Error'))
          return
        }

        const json = JSON.parse(body)

        resolve(json.data.images.original.url)
      })
    })
  }

  _body (obj) {
    return Object.assign({}, obj, { api_key: this.apiKey })
  }
}
