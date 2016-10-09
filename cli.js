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

args.check()
.then(() => {
  spinner.setSpinnerTitle(`${chalk.dim('%s')} Searching GIF`)
  spinner.start()
  const gagPage = new NineGag({ url: args.url })
  return gagPage.parse()
})
.then(mp4Url => {
  spinner.setSpinnerTitle(`${chalk.dim('%s')} Generating GIF`)
  const giphy = new Giphy({ mp4Url, source: args.url })
  return giphy.generate()
})
.then(gifUrl => {
  spinner.setSpinnerTitle(`${chalk.dim('%s')} Downloading GIF`)
  return Utils.download(gifUrl, args.dest)
})
.then(() => {
  spinner.stop(true)
  console.log(chalk.green(`✓ Saved GIF to ${args.dest}`))
})
.catch(e => {
  spinner.stop(true)
  console.log(chalk.red(`× Error: ${e}`))
  process.exit(1)
})
