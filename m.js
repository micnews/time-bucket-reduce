var toPull = require('stream-to-pull-stream')
var split = require('pull-split')
var pull = require('pull-stream')
var csvLine = require('csv-line')

var c = {}

pull(
  toPull(process.stdin),
  split(),
  pull.map(csvLine.decode),
  pull.filter(function (m) {
    return m[1] === 'click'
  }),
  pull.map(function (m) {
    var type = m[6]
    c[type] = (c[type] || 0) + 1
  }),
  pull.drain(null, function () {
    console.log(c)
  })
)

