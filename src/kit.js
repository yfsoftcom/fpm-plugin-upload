const crypto = require('crypto');
const debug = require('debug')('fpm-plugin-upload');
const fs = require('fs');

const readMd5 = (stream) =>{
  return new Promise((reslove) => {
    let md5sum = crypto.createHash('md5');
    // const stream = fs.createReadStream(url);
    stream.on('data', function(chunk) {
      md5sum.update(chunk);
    });
    stream.on('end', function() {
      const fileMd5 = md5sum.digest('hex');
      reslove( { md5: fileMd5, size: stream.bytesRead });
    })
  })
}

exports.readMd5 = readMd5;