var fs = require('fs');
var lessc = require('./lessc');
var exec = require('child_process').exec;

var path = require('path');

/*
 * copy file
 */

exports.copy = function(temp, target, callback){
    // console.log('=====>', temp);
    // console.log('=====>', target);
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
        throw '参数错误';
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
        throw '参数错误';
    }else{
        _doExists(callback);
    }
}

/*
 * edit file
 */

exports.editLessFile = function (lessType, filepath, filename, param, callback) {
    if ( filepath && filename ) {
        fs.exists(filepath, function (exists) {
            if (exists) {
                fs.readFile(
                    filepath,
                    'utf-8',
                    function(err, data) {
                        if (err) {
                            callback(err);
                            return false;
                        } else {
                            var strFile = data;
                            for(var key in param){
                                var reg = new RegExp('\@' + key + '[^\\;]+\\;', 'gi');
                                strFile = strFile.replace(reg, '@' + key + ':' + param[key] + ';');
                            }
                            var resultBuffer = new Buffer(strFile);
                            fs.writeFile(filepath, resultBuffer, function(writeErr){
                                if(writeErr) {
                                    callback(writeErr);
                                    return false;
                                }
                                lessc.lessc(lessType, filename.replace('config-', ''), callback);
                                // callback(err, 'success');
                            });
                        } 
                    }
                );
            }else{
                callback('路径错误');
            }
        });
    }else{
        callback('路径错误');
    }
}

