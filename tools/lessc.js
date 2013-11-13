var fs = require('fs');
var less = require('less');
var exec = require('child_process').exec;

var path = require('path');

var publicDir = path.join(__dirname, "..", "public");  

// init less dir
var comLessDir = path.join(publicDir, "less"); 
  
var lessDefDir = path.join(comLessDir, "default");
var lessViewDir = path.join(comLessDir, "preview");
var lessPubDir = path.join(comLessDir, "publish");

// init css dir
var cssDir = path.join(publicDir, "css"); 

/*
 * lessc less file
 */

function compile_less(input_file, output_file, callback) {  
    var cmd = ['lessc ', input_file, ' > ', output_file].join('');  
    // console.log(cmd);
    exec(
        cmd,
        function(error, stdout, stderr) {  
            if(error) {  
                callback && callback(error);  
            }else{
                // console.log("lessc : success");
                callback && callback(error, "success");
            }  
        }
    );  
}  

exports.lessc = function(pathType, filename, callback){
    var _lessPath;
    switch(pathType){
        case "preview":
            _lessPath = lessViewDir;
        break;
        case "publish":
            _lessPath = lessPubDir;
        break;
        default:
            _lessPath = lessDefDir;
        break;
    }

    var _doLessPath = path.join(_lessPath, filename);
    var _doCssPath = path.join(cssDir, filename.replace(/less$/gi, "css"));
    // console.log(_lessPath);
    // console.log(_cssPath);
    if ( path.extname(filename) === ".less" ) {
        compile_less(_doLessPath, _doCssPath, callback);
    }
}

exports.lesscAll = function (type) {
    var _lessPath;
    switch(type){
        case "preview":
            _lessPath = lessViewDir;
        break;
        case "publish":
            _lessPath = lessPubDir;
        break;
        default:
            _lessPath = lessDefDir;
        break;
    }
    // console.log(_lessPath);
    fs.readdir(_lessPath, function(err, files){
        if (err) {
            throw err;
        }
        for(var i = 0; i < files.length; i++){
            exports.lessc(type, files[i]);
        }
    });
}