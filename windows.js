
var parts = [
  'Milliseconds',
  'Seconds',
  'Minutes',
  'Hours',
  'Date',
  'Month',
  'FullYear'
]

var d = new Date()
var e = new Date(d)

//OH NO DATES
var UTC = 'UTC'

//parts.forEach(function (part, i) {
//  console.log(e.toISOString(), +e, part)
//  console.log(part == 'Date' ? 1 : 0)
//  e['set'+ UTC + part](part == 'Date' ? 1 : 0)
//  console.log(e['get'+ UTC + part]())
//})
//
module.exports = function (getTS, reduce, map, output, min) {

  min = min || 2

  var states = parts.map(function (name) {
    return {type: name, start: null, value: null}
  })

  return function (data) {
    var ts = getTS(data)
    var start = new Date(ts)

    data = map(data)

    for(var i = 0; i < states.length; i++) {
      var state = states[i]
      var part = state.type

      var doOutput = i >= min

      // if the data is within the current window
      // roll it into the current value.
      if(+start === state.start) {
        data = state.value = reduce(state.value, data)
        return
      }
      // if the data is inside a new window
      // output previous value, and start a new value.
      else {
        if(doOutput && state.value) output(state.value, state.start, part, i)
        state.start = +start
        var _data = data
        data = state.value
        state.value = reduce(null, _data)
        
      }
      //months are counted from 0 but dates are counted from 1 (!!!)
      start['set'+ UTC + part](part == 'Date' ? 1 : 0)
    }
  }
}


if(!module.parent) {

  var NOW = Date.now()
  var ts = NOW

  var windows = module.exports(function ts (e) { 
    return e.ts
  }, function reduce (a, b) {
    return (a || 0) + b
  }, function map () {
    return 1
  }, console.log)

  while(ts < NOW+10000000000) {
    windows({ts: ts += Math.round(Math.random()*10000), value: Math.random()})
  }

}
