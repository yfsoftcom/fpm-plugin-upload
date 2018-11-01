const _ = require('lodash');
const multer = require('koa-multer');
const path = require('path');
const fs = require('fs');
var crypto = require('crypto')

//将上传的信息保存在内存中
var datas = {}

module.exports = {
  bind: (fpm) => {
    const config = fpm.getConfig('upload', {
      dir: 'public/uploads',
      field: 'file',
      accept: [
        'application/octet-stream',
        'application/json',
        'application/zip',
        'application/x-zip-compressed',
        'image/png',
        'image/jpeg'],    // 上传的文件类型限制
      limit: 5,  // 5MB

    })
    const fileFilter = (req, file, cb) =>{
      if(_.indexOf(config.accept, file.mimetype)> -1){
          cb(null, 1)
      }else{
          cb({ errno: -801, code: 'TYPE_NOT_ALLOWD', message: 'only images, zip, json accept'})
      }
    }

    const dest = path.join(fpm.get('CWD'), config.dir);
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, dest)
      },
      filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
          cb(err, err ? undefined : (raw.toString('hex') + path.extname(file.originalname)))
        })
      }
    })
    const upload = multer({ fileFilter: fileFilter, storage: storage, limits: { fileSize: config.limit * 1024 * 1024 }});

    // 上传表单以file为文件的字段
    const defaultHandler = upload.single(config.field);

    // 捕获异常
    const handler = async (ctx, next) => {
        try{
            await defaultHandler(ctx, next)
            let data = ctx.req.file;
            data.hash = path.basename(data.filename, path.extname(data.filename));
            datas[data.hash] = data;
            fpm.publish('#upload/success', data);
            datas['latest'] = data;
            ctx.body = {
                errno: 0,
                data: _.assign({
                    id: data.hash,
                    path: path.join(config.dir, data.filename),
                    url: '/download/' + data.hash,
                })
            }
        }catch(e){
            ctx.body({
              errno: -1,
              message: e.toString(),
            })
        }
    }
    fpm.registerAction('FPM_ROUTER', () => {
      console.log('Run BEFORE_SERVER_START Actions')
      const router = fpm.createRouter();
      router.post('/upload', handler);

      // 下载文件的路由
      router.get('/download/:id', async (ctx, next) => {
          let data = datas[ctx.params.id]
          ctx.type = data.mimetype
          ctx.attachment(data.originalname)
          ctx.body = await fs.createReadStream(data.path)
          await next()
      })

      fpm.bindRouter(router);
    })
  }
}
