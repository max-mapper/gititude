#!/usr/bin/env node

var homedir = require('home-dir')
var fs = require('fs')
var mkdirp = require('mkdirp')
var prompt = require('prompt-sync')
var child = require('child_process')
var currentLocation = require('current-location')
var args = require('minimist')(process.argv.slice(2))

var configPath = args.home || (homedir() + '/.config')
var entries = configPath + '/gititude.txt'
mkdirp.sync(configPath)

var cmd = args._[0]

if (!cmd) {
  console.error(fs.readFileSync(__dirname + '/usage.txt').toString())
  process.exit(1)
}

if (cmd === 'set') {
  var lat = args.lat
  var lon = args.lon

  if (!lat || !lon) {
    if (!process.stdin.isTTY) process.exit(1)
    process.stdout.write('Latitude' + (lat ? ' (' + lat + ')' : '') + ': ')
    lat = prompt() || lat
    process.stdout.write('Longitude' + (lon ? ' (' + lon + ')' : '') + ': ')
    lon = prompt() || lon
  }

  var date = args.date
  if (!date) date = new Date()
  else date = new Date(date)
  appendEntry(lat, lon, date)
}

if (cmd === 'list') {
  fs.createReadStream(entries).on('error', function hayguyz () {}).pipe(process.stdout)
}

if (cmd === 'latest') {
  console.log(JSON.stringify(latest()))
}

if (cmd === 'commit') {
  var latest1 = latest()
  if (!latest1) throw new Error('Sorry sir or madam you must first do gititude set or update')
  var commit = child.spawn('git', process.argv.slice(2), {stdio: 'inherit'})
  commit.on('exit', function (code) {
    if (code !== 0) return console.error('UHOH git exited non-zero')
    var tagId = 'gititude-' + +new Date()
    var tag = child.spawn('git', ['tag', '-m', JSON.stringify(latest1), tagId])
    tag.on('exit', process.exit)
  })
}

if (cmd === 'update') {
  currentLocation(function (err, loc) {
    if (err) throw new Error(err)
    if (!loc) throw new Error('Could not get location')
    var latestLoc = latest()
    if (latestLoc && latestLoc.latitude === loc.latitude && latestLoc.longitude === loc.longitude) {
      console.log('Already up to date')
      process.exit(0)
    }
    console.log('Adding new location to entry log', loc)
    appendEntry(loc.latitude, loc.longitude, new Date())
  })
}

function latest () {
  try {
    var stat = fs.statSync(entries)
    var fd = fs.openSync(entries, 'r')
    var buf = new Buffer(1024)
    var read = fs.readSync(fd, buf, 0, 1024, stat.length - 1024)
    buf = buf.slice(0, read)
    var lines = buf.toString().trim().split()
    var latest = JSON.parse(lines[lines.length - 1])
    return latest
  } catch (e) {}
}

function appendEntry (lat, lon, date) {
  date = date.toISOString()
  var location = JSON.stringify({latitude: lat, longitude: lon, timestamp: date}) + '\n'
  fs.createWriteStream(entries, {flags: 'a+'}).end(location)
}
