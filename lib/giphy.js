'use strict'

const request = require('request')

/**
 * Class handling everything related to Giphy
 */
module.exports =
class Giphy {
  constructor ({ mp4Url, source }) {
    this.apiKey = 'dc6zaTOxFJmzC'

    this.member = {
      mp4Url,
      source
    }
  }

  /**
   * Send the mp4 to giphy and get the url to the generated gif
   *
   * @returns {Promise}   A Promise resolved with the gif url
   */
  generate () {
    return Promise.resolve()
    .then(() => { return this._uploadVideo() })
    .then(id => { return this._getGifUrl(id) })
  }

  /**
   * Send the mp4 to giphy
   *
   * @returns {Promise}  A Promise resolved with the giphy id
   */
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

        // check for bad api_key or bad file
        if (response.statusCode === 403) {
          reject(new Error('Upload Client Error'))
          return
        }

        // Giphy should return a 200 OK
        if (response.statusCode !== 200) {
          reject(new Error('Misc Connection Error'))
          return
        }

        const json = JSON.parse(body)

        resolve(json.data.id)
      })
    })
  }

  /**
   * Get the url to the original gif from giphy
   *
   * @returns {Promise}  A Promise resolved with the gif url
   */
  _getGifUrl (id) {
    return new Promise((resolve, reject) => {
      request(`http://api.giphy.com/v1/gifs/${id}?api_key=${this.apiKey}`,
      (error, response, body) => {
        if (error) {
          reject(error)
          return
        }

        // 403 should be returned for bad api_key
        if (response.statusCode === 403) {
          reject(new Error('Fetch Client Error'))
          return
        }

        const json = JSON.parse(body)

        resolve(json.data.images.original.url)
      })
    })
  }

  /**
   * Adds the api_key to a giphy post body
   *
   * @returns {Object}  Form Object
   */
  _body (obj) {
    return Object.assign({}, obj, { api_key: this.apiKey })
  }
}
