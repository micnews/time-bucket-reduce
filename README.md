# time-bucket-reduce

reduce time series events into buckets: seconds, minutes, hours, date, month, full-year

## Example 

by default, TBR will count all inputs into each
bucket and log to stdout when a bucket is filled.
If you data items have a `ts` property then the following will just work,
and will output counts into buckets 1 minute or larger.

``` js
var TimeBucketReduce = require('time-bucket-reduce')

var add = TimeBucketReduce ()
timeSeriesStream.on('data', add)
```

If you have more interesting data, then configure TBR with the following optionss.

``` js
var add = TimeBucketReduce ({
  //ts: get the time stamp property from a row.
  ts: function (e) { return e.ts }

  //map: convert the row into the same format as reduce uses (optional)
  // map defaults to return 1 (for counting)

  map: function (e) { return e.value },

  //reduce: combine two values into one aggregate.
  // the initial value for a will be null.

  reduce: function (a, b) {
    return (a || 0) + b // SUM
  },

  min: 1, //log seconds

  output: function (value, start, part) {
    console.log(
      part,  // the time bucket, Seconds, Minutes, Hours, etc
      start, // unix time stamp of the start of the bucket.
      value  // aggregated value
    )
  }
})
```

## TODO

save into leveldb, recover after crashes, and aggregate "all time" bucket...

but that is functionality for another module...

## License

MIT
