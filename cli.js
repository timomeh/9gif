#!/usr/bin/env node

'use strict'

const Spinner = require('cli-spinner').Spinner
const chalk = require('chalk')
const Args = require('./lib/args')
const NineGag = require('./lib/nine-gag')
const Giphy = require('./lib/giphy')
const Utils = require('./lib/utils')

const args = new Args(process.argv)
const spinner = new Spinner()
spinner.setSpinnerString(18)

/* Start process */

args.check() /* Check arguments for validity and sanitize them */
.then(() => {
  /* Parse the 9GAG page for a mp4 link */

  spinner.setSpinnerTitle(`${chalk.dim('%s')} Searching GIF`)
  spinner.start()
  const gagPage = new NineGag({ url: args.url })
  return gagPage.parse()
})
.then(mp4Url => {
  /* Send the mp4 to Giphy and generate a read gif */

  spinner.setSpinnerTitle(`${chalk.dim('%s')} Generating GIF`)
  const giphy = new Giphy({ mp4Url, source: args.url })
  return giphy.generate()
})
.then(gifUrl => {
  /* Download the gif from giphy to local path */

  spinner.setSpinnerTitle(`${chalk.dim('%s')} Downloading GIF`)
  return Utils.download(gifUrl, args.dest)
})
.then(() => {
  /* Success! */

  spinner.stop(true)
  console.log(chalk.green(`✓ Saved GIF to ${args.dest}`))
})
.catch(e => {
  /* Complete error handling */
  // TODO: Format nice errors

  spinner.stop(true)
  console.log(chalk.red(`× Error: ${e}`))
  process.exit(1)
})
