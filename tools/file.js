var fs = require('fs');
var lessc = require('./lessc');
var exec = require('child_process').exec;

var path = require('path');

var public_dir = path.join(__dirname, "..", "public");  
  
var less_dir = path.join(public_dir, "less", "base.less");  
var css_dir = path.join(public_dir, "css", "base.css"); 

/*
 * copy file
 */

exports.copy = function(temp, target, callback){
    // console.log("=====>", temp);
    // console.log("=====>", target);
    var _temp = temp.constructor === Array ? temp : [temp];
    var _target = target.constructor === Array ? target : [target];
    var _doCopy = function(tem, tar, doCallback){
        fs.readFile(tem, function(err, data){
            if (err) {
                throw err;
            }
            fs.writeFile(tar, data, function(e, r){
                if ( _temp.length ) {
                    _doCopy(_temp.shift(), _target.shift(), doCallback);
                } else{
                    doCallback();
                }
            });
        });
    };
    if ( _temp.length != _target.length ) {
        throw "参数错误";
    }else{
        _doCopy(_temp.shift(), _target.shift(), callback);
    }
}

/*
 * exists file
 */

exports.existsConfig = function(temp, target, callback){
    var _temp = temp.constructor === Array ? temp : [temp];
    var _target = target.constructor === Array ? target : [target];
    var _doExists = function(doCallback){
        if ( _temp.length ) {
            var tem =  _temp.shift();
            fs.exists(tem, function (exists) {
                var tar =  _target.shift();
                // console.log(tem, exists);
                if (exists) {
                    fs.exists(tar, function (_exists) {
                        // console.log(tar, _exists);
                        if (_exists) {
                            _doExists(doCallback);
                        }else{
                            exports.copy(tem, tar, function(){
                                _doExists(doCallback);
                            });
                        }
                    });
                }else{
                    _doExists(doCallback);
                }
            });
        } else{
            doCallback();
        }
    };
    
    if ( _temp.length != _target.length ) {
        throw "参数错误";
    }else{
        _doExists(callback);
    }
}

/*
 * edit file
 */

exports.editFile = function (filepath, filename, param, callback) {
    if ( filepath && filename ) {
        fs.realpath(filepath, function(err, rpath){
            if ( err ) {
                callback(err);
                return false;
            }
            fs.readFile(
                rpath + "/" + filename,
                'utf-8',
                function(readErr, data) {
                    if (readErr) {
                        callback(readErr);
                        return false;
                    } else {
                        var strFile = data;
                        for(var key in param){
                            var reg = new RegExp("\@" + key + "[^\\;]+\\;", "gi");
                            strFile = strFile.replace(reg, "@" + key + ":" + param[key] + ";");
                        }
                        var resultBuffer = new Buffer(strFile);
                        fs.writeFile(rpath + "/" + filename,resultBuffer,function(writeErr){
                            if(writeErr) {
                                callback(writeErr);
                                return false;
                            }
                            console.log(rpath);
                            lessc.lessc(rpath.replace(/\\[^\\]+\\?$/gi,"\\"), filename.replace("config-", ""), callback);
                            // callback(readErr, "success");
                        });
                    } 
                }
            );
        });
    }else{
        callback('路径错误');
    }
}

