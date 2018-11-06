## FPM-PLUGIN-UPLOAD
用于文件上传的插件

### Install
```bash
npm i fpm-plugin-upload --save
```

### Useage

- default config

  ```javascript
  {
    "upload":{
      "dir": "public/uploads/",
      "field": "upload",
      "uploadRouter": "/upload",
      "base": "/uploads/",
      "accept": [
        "application/octet-stream",
        "application/json",
        "application/zip",
        "application/x-zip-compressed",
        "image/png",
        "image/jpeg"],    // Allowed type
      "limit": 5,         // 5MB
    }
  }
  ```

- Subscribe the event to save data:

  ```javascript
  fpm.subscribe("#upload/success", (topic, data)=>{
    console.log(topic, data);
  });

  // the data:
  {
    fieldname: "upload",
    originalname: "test.json",
    encoding: "7bit",
    mimetype: "application/json",
    destination: "/Users/yfsoft/Product/fpm-plugin-upload/public/uploads",
    filename: "fcf56f1912879c4acbf03968b2b220dc.json",
    path: "/Users/yfsoft/Product/fpm-plugin-upload/public/uploads/fcf56f1912879c4acbf03968b2b220dc.json",
    size: 10,
    hash: "fcf56f1912879c4acbf03968b2b220dc"
  }

  // the data if qiniu :
  {
    fieldname: 'upload',
    originalname: 'test.json',
    encoding: '7bit',
    mimetype: 'application/json',
    hash: 'FvYprkS3s9z-1ETTY-Ym7fQR7Gmo',
    key: '408e19877d7b2c73_test.json',
    url: 'http://cdn.yunplus.io/408e19877d7b2c73_test.json',
    filename: '408e19877d7b2c73_test.json'
  }
  ```

### Support Qiniu

- modify config.json

  ```javascript
  {
    "upload":{
      "dir": "public/uploads/",
      "field": "upload",
      "uploadRouter": "/upload",
      "base": "/uploads/",
      "accept": [
          "application/octet-stream",
          "application/json",
          "application/zip",
          "application/x-zip-compressed",
          "image/png",
          "image/jpeg"],
      "limit": 5,
      "storage": "qiniu", // add qiniu
      "qiniu": {
        "bucket": "yfsoft",
        "domain": "cdn.yunplus.io",
        "ACCESS_KEY": "*",
        "SECRET_KEY": "*",
        "zone": "z2"
      }
    }
  }
  ```

- install `qiniu`

  `$ npm i qiniu --save`

- the resule of the uploaded

  ```javascript
  {
    errno: 0,
    uploaded: true,
    url: 'http://cdn.yunplus.io/408e19877d7b2c73_test.json',
    data:{
      hash: '408e19877d7b2c73_test',
      path: 'http://cdn.yunplus.io/408e19877d7b2c73_test.json'
    }
  }
  ```
