const _ = require('lodash');
const crypto = require('crypto');
const qiniu = require('qiniu');
const config = new qiniu.conf.Config();

let _options = {
  isInit: false,
  bucket: 'yfsoft',
  domain: '*****',
  ACCESS_KEY:'*****',
  SECRET_KEY:'*****',
  zone: 'z2',
}
let mac;
const init = (options) => {
  _options = _.assign(_options, _.assign(options, {isInit: true}))
  qiniu.conf.ACCESS_KEY = _options.ACCESS_KEY
  qiniu.conf.SECRET_KEY = _options.SECRET_KEY
  // 空间对应的机房
  config.zone = qiniu.zone[`Zone_${ _options.zone || 'z2' }`];
  mac = new qiniu.auth.digest.Mac(_options.ACCESS_KEY, _options.SECRET_KEY);
}
const random = () => {
  return crypto.randomBytes(8).toString('hex');
}
//构建上传策略函数
const getToken = ( key ) => {
  let putPolicy = new qiniu.rs.PutPolicy({ scope: _options.bucket + ':' + key });
  let token = putPolicy.uploadToken(mac);
  return token
}
//构造上传函数
const uploadStream = async (file) => {
  const uuid = random();
  const key = uuid + '_' + file.originalname;
  const uptoken = getToken(key);
  const extra = new qiniu.form_up.PutExtra();
  const formUploader = new qiniu.form_up.FormUploader(config);
  return new Promise( (rs, rj) =>{
    formUploader.putStream(uptoken, key, file.stream, extra, (err, ret) => {
      if(err){
        rj(err)
      }else{
        if(ret.code){
          rj(ret)
        }else{
          ret.url = 'http://' + _options.domain + '/'+ ret.key;
          ret.filename = ret.key;
          rs(ret)
        }
      }
    })
  })
}

const sync = async (file)=>{
  if(!_options.isInit)
    throw new Error('options not inited')
  //调用uploadFile上传
  try{
    let rst = await uploadStream(file)
    return rst
  }catch(e){
    return e;
  }
}

exports.init = init;
exports.sync = sync;