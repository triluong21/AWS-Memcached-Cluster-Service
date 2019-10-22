const ELASTICACHE_CONFIG_ENDPOINT = "mem-me-ky0mae2xq2zo.ih67sh.0001.use1.cache.amazonaws.com:11211";
var Memcached = require("memcached");
Memcached.config.poolSize = 25;
Memcached.config.retries = 2;
Memcached.config.retry = 1;
const memcached = new Memcached(ELASTICACHE_CONFIG_ENDPOINT, {});
// memcached.connect( ELASTICACHE_CONFIG_ENDPOINT, function( err, conn ){
//   if( err ) throw new Error( err );
//   console.log( conn.server );
// });
memcached.set('foo', 'bar', 10, function (err) { /* stuff */ });
memcached.get('foo', function (err, data) {
  console.log(data);
});