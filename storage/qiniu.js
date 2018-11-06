
const { init, sync } = require('./uploader.js');
function QiniuStorage (opts) {
  init(opts);
}

QiniuStorage.prototype._handleFile = function _handleFile (req, file, cb) {
  sync(file).then( ret => {
    ret.type = 'qiniu';
    cb(null, ret);
  }).catch(err => {
    cb(err);
  });
}

QiniuStorage.prototype._removeFile = function _removeFile (req, file, cb) {
  delete file.buffer;
  cb(null);
}

module.exports = function (opts) {
  return new QiniuStorage(opts);
}