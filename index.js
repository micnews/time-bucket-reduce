
var parts = [
  'Milliseconds',
  'Seconds',
  'Minutes',
  'Hours',
  'Date',
  'Month',
  'FullYear'
]

//OH NO DATES
var UTC = 'UTC'

function createError (message) {
  return function () {
    throw new Error('message')
  }
}

module.exports = function (opts) {
  opts = opts || {}
  var ts = opts.ts || function (e) { return e.ts || e[0] }
  var reduce = opts.reduce || function (a, b) { return (a || 0) + b }
  var min = opts.min || 2
  var output = opts.output || console.log.bind(console)

  var map = opts.map || function id (e) { return 1 }

  var states = parts.map(function (name) {
    return {type: name, start: null, value: null}
  })

  function rollup (i, start, data) {
    if(i >= states.length) return
    var state = states[i]
    var prev = states[i - 1].type
    start['set'+ UTC + prev](prev == 'Date' ? 1 : 0)

    if(+start == state.start)
      return state.value = reduce(state.value, data)

    if(i >= min && state.value)
      output(state.value, state.start, state.type, i)

    state.start = +start
    rollup(i+1, start, state.value)
    state.value = reduce(null, data)
  }

  return function (data) {
    var mapped = map(data)
    //treat map that returns null as filter
    if(mapped == null) return

    return rollup(1, new Date(ts(data)), mapped)
  }
}


if(!module.parent) {

  var NOW = Date.now()
  var ts = NOW

  var windows = module.exports({
    ts: function (e) { return e.ts }, 
    reduce: function (a, b) { return (a || 0) + b },
    map: function () { return 1}
  })

  while(ts < NOW+10000000000) {
    windows({ts: ts += Math.round(Math.random()*10000), value: Math.random()})
  }

}
