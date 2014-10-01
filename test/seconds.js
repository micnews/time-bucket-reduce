

var pull = require('pull-stream')
var tape = require('tape')

var TimeBucketReduce = require('../')

function create () {


  return agg
}

function test (name, n, step, expected) {
  tape(name, function (t) {

    var agg = {}

    var TBR = TimeBucketReduce({
      output: function (value, start, part) {
        agg[part] = (agg[part] || 0) + 1
      },
      min: 1
    })

    pull(
      pull.count(n),
      pull.map(function (i) {
        return {ts: i*step, value: i%2}
      }),
      pull.through(TBR),
      pull.drain(null, function () {

        console.log(agg)
        t.deepEqual(agg, expected)
        t.end()
      })
    )
    
  })
}

test('count to 90 seconds', 90, 1000, {
  Seconds: 90,
  Minutes: 1
})

test('count to 119 seconds', 119, 1000, {
  Seconds: 119,
  Minutes: 1
})

test('count to 120 seconds', 120, 1000, {
  Seconds: 120,
  Minutes: 2
})

test('count to 121 seconds', 121, 1000, {
  Seconds: 121,
  Minutes: 2
})

test('count seconds to 1 hourseconds', 3600, 1000, {
  Seconds: 3600,
  Minutes: 60,
  Hours: 1
})

test('count seconds to 1 day', 24*3600, 1000, {
  Seconds: 24*3600,
  Minutes: 24*60,
  Hours: 24,
  Date: 1
})

//times above days are not all the same length, so testing is hard.
//added +1 to get it to work...
test('count minutes to one year', 365*24*60 + 1, 60000, {
  Seconds: 365*24*60 + 1,
  Minutes: 365*24*60,
  Hours: 365*24,
  Date: 365,
  Month: 12,
  FullYear: 1
})


