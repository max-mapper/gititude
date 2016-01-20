var os = require('os')
var test = require('tape')
var spawn = require('tape-spawn')
var mkdirp = require('mkdirp')
var rimraf = require('rimraf')

var bin = __dirname + '/index.js'
var tmp = os.tmpdir() + '/gititude-tests'
rimraf.sync(tmp)
mkdirp.sync(tmp)

test('set', function (t) {
  var g = spawn(t, bin + ' set --lat=5 --lon=5 --date=1 --home=' + tmp)
  g.stdout.empty()
  g.stderr.empty()
  g.end()
})

test('latest', function (t) {
  var g = spawn(t, bin + ' latest --home=' + tmp)
  g.stdout.match('{"latitude":5,"longitude":5,"timestamp":"1970-01-01T00:00:00.001Z"}\n')
  g.stderr.empty()
  g.end()
})

test('list', function (t) {
  var g = spawn(t, bin + ' latest --home=' + tmp)
  g.stdout.match('{"latitude":5,"longitude":5,"timestamp":"1970-01-01T00:00:00.001Z"}\n')
  g.stderr.empty()
  g.end()
})
