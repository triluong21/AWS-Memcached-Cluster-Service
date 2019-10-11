'use strict';
var utilityFunctions = require('./utility');
// var Memcached = require('elasticache-client');
var ec2Instance_endpoint = 'ec2-3-93-61-192.compute-1.amazonaws.com:11211';
var elasticache_config_endpoint  = 'mem-me-1o8anj9rf6xbt.ih67sh.cfg.use1.cache.amazonaws.com:11211';
var Memcached = require('memcached');
var memcached = new Memcached(elasticache_config_endpoint);
Memcached.config.poolSize = 25;

module.exports.MemCachedService = async event => {
  // const UUIDnum = utilityFunctions.getUniqueId();
  memcached.connect( elasticache_config_endpoint, function( err, conn ){
    if( err ) { 
      console.log( "Error Big Time: ", conn.server );
    } else {
      console.log( "We are CONNECTED!!!");
      memcached.set('foo', 'bar', 10000, function (err) { /* stuff */ });
      memcached.get('foo', function (err, data) {
        console.log("We got the value: ", data);
      });
    }
  });
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `"UUID: " ${utilityFunctions.getUniqueId()}`,
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
