#!/usr/bin/env node

'use strict'

const Args = require('./lib/args')
const Parser = require('./lib/parser')
const Gif = require('./lib/gif')

try {
  var args = new Args(process.argv)
} catch (e) {
  console.log(e)
  process.exit(1)
}

const parser = new Parser(args.url)

parser.getGifSrc()
.then(src => (new Gif(src, args.url, args.dest).convertVideo()))
.catch(e => { throw e })
