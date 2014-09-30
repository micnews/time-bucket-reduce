

var pull = require('pull-stream')
var tape = require('tape')

var timeview = require('../')

tape('count all seconds, minutes, hours, days', function (t) {

var agg = {}
var expected = {
  '0': 1000000,
  '1': 999960,
  '2': 16620,
  '3': 267,
  '4': 1
}

  pull(
    pull.count(1000000),
    pull.map(function (i) {
      return {ts: i*1000, value: i%2}
    }),
    pull.through(timeview(timeview.count, function (data, level, id) {
      agg[level] = (agg[level] || 0) + data.value
    })),
    pull.drain(null, function () {

      console.log(agg)
      t.deepEqual(agg, expected)
      t.end()
    })
  )

})
