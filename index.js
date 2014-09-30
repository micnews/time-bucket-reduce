

var pull = require('pull-stream')
var through = require('pull-through')


function noop() {}

function count (acc, item) {
  return {
    ts: acc ? acc.ts : item.ts,
    value: acc ? acc.value + 1 : 1
  }
}

function sum (acc, item) {
  return {
    ts   : acc ? acc.ts : item.ts,
    value: acc ? acc.value + item.value :  item.value
  }
}


function groupBy(group, reduce, log) {
  var acc = null
  var gid = null
  var ret = false
  return function (data, level) {
    if(!data) return acc
    var id = group(data), ret
    if(gid != null && gid !== id) {
      var ret = acc; acc = null
      log(ret, level, id)
    }
    gid = id
    acc = reduce(acc, data, id)
    if(ret) {
      return ret
    }
  }
}

function aggregate (reduce, log) {
  var groups = [
    groupBy(get('seconds'), reduce, log),
    groupBy(get('minutes'), reduce, log),
    groupBy(get('hours'), reduce, log),
    groupBy(get('date'), reduce, log),
    groupBy(get('month'), reduce, log)
  ]

  return function r (data) {
    for(var i = 0; data && i < groups.length; i++)
      data = groups[i](data, i)
  }

}

function get(wname) {
  var mname = 'get' +
    wname[0].toUpperCase() + 
    wname.substring(1).toLowerCase()
  var prop = Date.prototype[mname]
  return function (data) {
    return prop.call(new Date(data.ts))
  }
}

module.exports = aggregate
module.exports.sum = sum
module.exports.count = count
