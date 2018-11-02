var should = require("chai").should();
var request = require('superagent');
const fs = require('fs');
const path = require('path');

const crypto = require('crypto');

const baseDir = path.join(__dirname, '../public/uploads/');

describe('Function', function(){

  after(done => {
    // clean
    fs.readdir(baseDir, (err, files) => {
      if (err) throw err;
      for(let f of files){
        fs.unlinkSync(path.join(baseDir, f));
      }
      done()
    })
  })

  it('Function Upload', function(done){
    request
     .post('http://localhost:9999/upload')
     .attach('upload', "test/test.json")
     .end((err, result) => {
       if(err) throw err;
       console.log(result.body);
       done(err);
     })
  })
})
