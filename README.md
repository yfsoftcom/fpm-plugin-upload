## FPM-PLUGIN-UPLOAD
用于文件上传的插件

### Install
```bash
npm i fpm-plugin-upload --save
```

### Useage

- config

  ```javascript
  {
    "upload":{
      "dir": "public/uploads",
      "field": "upload",
      "base": "/uploads", // the origin file webserver perfix
      "accept": [
        "application/octet-stream",
        "application/json",
        "application/zip",
        "application/x-zip-compressed",
        "image/png",
        "image/jpeg"],    // 上传的文件类型限制
      "limit": 5,  // 5MB
    }
  }
  ```

- Subscribe the event to save data:

  ```javascript
  fpm.subscribe('#upload/success', (topic, data)=>{
    console.log(topic, data);
  });

  // the data:
  { 
    fieldname: 'file',
    originalname: 'test.json',
    encoding: '7bit',
    mimetype: 'application/json',
    destination: '/Users/yfsoft/Product/fpm-plugin-upload/public/uploads',
    filename: 'fcf56f1912879c4acbf03968b2b220dc.json',
    path: '/Users/yfsoft/Product/fpm-plugin-upload/public/uploads/fcf56f1912879c4acbf03968b2b220dc.json',
    size: 10,
    hash: 'fcf56f1912879c4acbf03968b2b220dc' 
  }
  ```