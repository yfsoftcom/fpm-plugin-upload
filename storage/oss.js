const crypto = require('crypto');
const debug = require('debug')('fpm-plugin-upload:oss');
const OSS = require('ali-oss');
const { readMd5, random } = require('../src/kit');

function OssStorage (opts) {
  this.subdir = opts.subdir || '_origin';
  this.client = new OSS({
    region: opts.zone,
    accessKeyId: opts.ACCESS_KEY,
    accessKeySecret: opts.SECRET_KEY,
    bucket: opts.bucket
  });
}

OssStorage.prototype._handleFile = function _handleFile (req, file, cb) {
  debug('file: %O', file);
  const uuid = random();
  const key = `${uuid}_${file.originalname}`;
  Promise.all([
    this.client.putStream(`${this.subdir}/${key}`, file.stream),
    readMd5(file.stream)
    ])
    .then(([x, y]) => {
      cb(null, { ...x, ...y,  filename: key});
    })
    .catch(e => cb(e));
}

OssStorage.prototype._removeFile = function _removeFile (req, file, cb) {
  delete file.buffer;
  cb(null);
}

module.exports = function (opts) {
  return new OssStorage(opts);
}