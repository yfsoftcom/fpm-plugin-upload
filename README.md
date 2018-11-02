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
    fieldname: "file",
    originalname: "test.json",
    encoding: "7bit",
    mimetype: "application/json",
    destination: "/Users/yfsoft/Product/fpm-plugin-upload/public/uploads",
    filename: "fcf56f1912879c4acbf03968b2b220dc.json",
    path: "/Users/yfsoft/Product/fpm-plugin-upload/public/uploads/fcf56f1912879c4acbf03968b2b220dc.json",
    size: 10,
    hash: "fcf56f1912879c4acbf03968b2b220dc" 
  }
  ```