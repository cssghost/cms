var file = require('./file');
var lessc = require('./lessc');
var util = require('util');
var fs = require('fs');
var path = require('path');

var publicDir = path.join(__dirname, '..', 'public');  

// init less dir
var comLessDir = path.join(publicDir, 'less'); 
  
var lessDefDir = path.join(comLessDir, 'default');
var lessViewDir = path.join(comLessDir, 'preview');
var lessPubDir = path.join(comLessDir, 'publish');

// init css dir
var cssDir = path.join(publicDir, 'css'); 

function Config(options){
    var self = this;

    // files dir
    self.publicDir = publicDir;

    self.comLessDir = comLessDir;

    self.lessDefDir = lessDefDir;
    self.lessViewDir = lessViewDir;
    self.lessPubDir = lessPubDir;

    self.cssDir = cssDir;

    // server request
    self.request  = options.request;
    self.response = options.response;

    // view
    self.viewName = options.viewName;
    self.viewParam = options.viewParam || [];

    // page load callback
    self.viewCallback = options.viewCallback;
}

exports.config = Config;

Config.prototype.pageLoad = function(){
    var self = this;
    var _defFile = path.join(self.lessDefDir, self.viewName + '.less');
    var _defConfigFile = path.join(self.lessDefDir, 'config', 'config-' + self.viewName + '.less');
    var _viewFile = path.join(self.lessViewDir, self.viewName + '.less');
    var _viewConfigFile = path.join(self.lessViewDir, 'config', 'config-' + self.viewName + '.less');
    var _pubFile = path.join(self.lessPubDir, self.viewName + '.less');
    var _pubConfigFile = path.join(self.lessPubDir, 'config', 'config-' + self.viewName + '.less');
    var _lessc = function(){
        lessc.lessc(
            "publish",
            self.viewName + ".less",
            function(e, r){
                if (e) {
                    throw e;
                }
                self.readConfig();
            }
        );
    };

    // 初始化less文件
    file.existsConfig(
        [_defConfigFile, _defConfigFile, _defFile, _defFile],
        [_pubConfigFile, _viewConfigFile, _pubFile, _viewFile],
        function(){
            _lessc();
            // self.response.send("page load");
        }
    );

};

Config.prototype.readConfig = function() {
    var self = this;
    var _pubFile = path.join(self.lessPubDir, self.viewName + '.less');
    var _pubConfigFile = path.join(self.lessPubDir, 'config', 'config-' + self.viewName + '.less');
    var _param = self.viewParam;
    var parseData = {};

    if ( _param.length ) {
        fs.exists(_pubConfigFile, function (exists) {
            if (exists) {
                fs.readFile(
                    _pubConfigFile,
                    'utf-8',
                    function(err, data) {
                        if (err) {
                            throw err;
                        }
                        var strFile = data;
                        for(var i = 0; i < _param.length; i++){
                            var reg = new RegExp('\\@' + _param[i] + '\\:([^\\n]+)\\;');
                            var matchResult = strFile.match(reg);
                            if ( matchResult ) {
                                parseData[_param[i]] = matchResult[1];
                            }else{
                                parseData[_param[i]] = "";
                            }
                        }
                        self.viewCallback(parseData);
                    }
                );
            }else{
                self.viewCallback(parseData);
            }
        });
    }else{
        self.viewCallback(parseData);
    }
};