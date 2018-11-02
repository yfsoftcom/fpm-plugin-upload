const _ = require('lodash');
const multer = require('koa-multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

module.exports = {
  bind: (fpm) => {
    const config = Object.assign({
      dir: 'public/uploads/',
      field: 'upload',
      uploadRouter: '/upload',
      base: '/uploads/',
      accept: [
        'application/octet-stream',
        'application/json',
        'application/zip',
        'application/x-zip-compressed',
        'image/png',
        'image/jpeg'],    // Allowed type
      limit: 5,  // 5MB

    }, fpm.getConfig('upload', {}));
    const fileFilter = (req, file, cb) =>{
      if(_.indexOf(config.accept, file.mimetype)> -1){
          cb(null, 1)
      }else{
          cb({ errno: -801, code: 'TYPE_NOT_ALLOWD', message: 'only images, zip, json accept'})
      }
    }

    const dest = path.join(fpm.get('CWD'), config.dir);
    const storage = multer.diskStorage({
      destination: (req, file, cb) =>{
        cb(null, dest)
      },
      filename: (req, file, cb) =>{
        crypto.randomBytes(16, (err, raw) =>{
          cb(err, err ? undefined : (raw.toString('hex') + path.extname(file.originalname)))
        })
      }
    })

    // define the default upload function
    const upload = multer({ fileFilter: fileFilter, storage: storage, limits: { fileSize: config.limit * 1024 * 1024 }});

    // default form handler
    const defaultHandler = upload.single(config.field);


    // 捕获异常
    const handler = async (ctx, next) => {
        try{
            await defaultHandler(ctx, next)
            const data = ctx.req.file;
            const { filename } = data;
            data.hash = path.basename(filename, path.extname(filename));

            fpm.publish('#upload/success', data);

            ctx.body = {
                errno: 0,
                uploaded: true,
                url: config.base + filename,
                data: {
                  hash: data.hash,
                  path: config.base + filename,
                }
            }
        }catch(e){
            ctx.body = {
              errno: -1,
              message: e.toString(),
              uploaded: false,
            };
        }
    }
    fpm.registerAction('FPM_ROUTER', () => {
      const router = fpm.createRouter();

      // bind the upload url handler.
      router.post(config.uploadRouter, handler);

      fpm.bindRouter(router);
    })
  }
}
