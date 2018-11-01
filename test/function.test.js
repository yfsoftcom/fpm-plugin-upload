var should = require("chai").should();
var request = require('superagent');
const fs = require('fs');

describe('Function', function(){
  beforeEach(done => {
    done()
  })

  afterEach(done => {
    done()
  })



  it('Function Upload', function(done){
    request
     .post('http://localhost:9999/upload')
     .attach('file', "test/test.json")
     .end((err, result) => {
       console.log(err, result.body);
       done(err);
     })
  })

  it('Function Download', function(done){

      request
        .get('http://localhost:9999/download/latest')
        .responseType('arraybuffer')
        .then((res) => {
          console.log(res.body.toString() == '{"v": "a"}');
          done();
        })
        .catch(err => {
          done(err);
        })
  })
})
