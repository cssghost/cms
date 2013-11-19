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

// init js dir
var comJsDir = path.join(publicDir, 'js');

var jsDefDir = path.join(comJsDir, 'cms', 'config', 'default');
var jsViewDir = path.join(comJsDir, 'cms', 'config', 'preview');
var jsPubDir = path.join(comJsDir, 'cms', 'config', 'publish');

var jsConfigDir = path.join(comJsDir, 'config');

function Config(options){
    var self = this;

    // files dir
    self.publicDir = publicDir;

    self.comLessDir = comLessDir;

    self.lessDefDir = lessDefDir;
    self.lessViewDir = lessViewDir;
    self.lessPubDir = lessPubDir;

    console.log('------>', self.lessPubDir);

    self.cssDir = cssDir;

    self.comJsDir = comJsDir;

    self.jsDefDir = jsDefDir;
    self.jsViewDir = jsViewDir;
    self.jsPubDir = jsPubDir;

    self.jsConfigDir = jsConfigDir;

    // server request
    self.request  = options.request;
    self.response = options.response;

    // view
    self.viewName = options.viewName;
    self.viewParam = options.viewParam || [];

    // edit less or js switch ==> { all, less, js }
    self.editType = options.editType || 'all' ;

    // page load callback
    self.viewCallback = options.viewCallback;
}

exports.config = Config;

Config.prototype.pageLoad = function(){
    var self = this;

    var _defLayoutFile = path.join(self.lessDefDir, 'layout.less');
    var _defLayoutConfigFile = path.join(self.lessDefDir, 'config', 'config-layout.less');
    var _viewLayoutFile = path.join(self.lessViewDir, 'layout.less');
    var _viewLayoutConfigFile = path.join(self.lessViewDir, 'config', 'config-layout.less');
    var _pubLayoutFile = path.join(self.lessPubDir, 'layout.less');
    var _pubLayoutConfigFile = path.join(self.lessPubDir, 'config', 'config-layout.less');

    var _lessDefFile = path.join(self.lessDefDir, self.viewName + '.less');
    var _lessDefConfigFile = path.join(self.lessDefDir, 'config', 'config-' + self.viewName + '.less');
    var _lessViewFile = path.join(self.lessViewDir, self.viewName + '.less');
    var _lessViewConfigFile = path.join(self.lessViewDir, 'config', 'config-' + self.viewName + '.less');
    var _lessPubFile = path.join(self.lessPubDir, self.viewName + '.less');
    var _lessPubConfigFile = path.join(self.lessPubDir, 'config', 'config-' + self.viewName + '.less');

    var _jsDefFile = path.join(self.jsDefDir, 'config-' + self.viewName + '.js');
    var _jsViewFile = path.join(self.jsViewDir, 'config-' + self.viewName + '.js');
    var _jsPubFile = path.join(self.jsPubDir, 'config-' + self.viewName + '.js');

    var _jsConfigFile = path.join(self.jsConfigDir, 'config-' + self.viewName + '.js');

    var _lessc = function(callback){
        lessc.lessc(
            'publish',
            self.viewName + '.less',
            function(e, r){
                if (e) {
                    throw e;
                }
                typeof callback == 'function' && callback();
            }
        );
    };

    var _copyFile = function(callback){
        file.copy(_jsPubFile, _jsConfigFile, function(e, r){
            typeof callback == 'function' && callback();
        });
    };

    var arrLessTemp = [_lessDefConfigFile, _lessDefConfigFile, _lessDefFile, _lessDefFile];
    var arrLessTarget = [_lessPubConfigFile, _lessViewConfigFile, _lessPubFile, _lessViewFile];

    var arrLayoutTemp = [_defLayoutConfigFile, _defLayoutConfigFile, _defLayoutFile, _defLayoutFile];
    var arrLayoutTarget = [_pubLayoutConfigFile, _viewLayoutConfigFile, _pubLayoutFile, _viewLayoutFile];

    arrLessTemp = self.viewName == 'layout' ? arrLayoutTemp : arrLayoutTemp.concat(arrLessTemp);
    arrLessTarget = self.viewName == 'layout' ? arrLayoutTarget : arrLayoutTarget.concat(arrLessTarget);

    var arrJsTemp = [_jsDefFile, _jsDefFile, _jsPubFile];
    var arrJsTarget = [_jsViewFile, _jsPubFile, _jsConfigFile];

    var arrTemp = [];
    var arrTarget = [];

    self.chooseType(
        function(){
            arrTemp = arrLessTemp.concat(arrJsTemp);
            arrTarget = arrLessTarget.concat(arrJsTarget);
        },
        function(){
            arrTemp = arrLessTemp;
            arrTarget = arrLessTarget;
        },
        function(){
            arrTemp = arrJsTemp;
            arrTarget = arrJsTarget;
        }
    );

    // init all config files
    file.existsConfig(
        arrTemp,
        arrTarget,
        function(){
            self.chooseType(
                function(){
                    _copyFile(function(){
                        _lessc(function(){
                            self.readConfig();
                        });
                    });
                },
                function(){
                    _lessc(function(){
                        self.readConfig();
                    });
                },
                function(){
                    _copyFile(function(){
                        self.readConfig();
                    });
                }
            );
        }
    );

};

Config.prototype.readConfig = function() {
    var self = this;
    var _lessPubFile = path.join(self.lessPubDir, self.viewName + '.less');
    var _lessPubConfigFile = path.join(self.lessPubDir, 'config', 'config-' + self.viewName + '.less');
    var _param = self.viewParam;
    var parseData = {};

    if ( _param.length ) {
        fs.exists(_lessPubConfigFile, function (exists) {
            if (exists) {
                fs.readFile(
                    _lessPubConfigFile,
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

Config.prototype.editPreview = function(){
    var self = this;
    var _lessViewConfigFile = path.join(self.lessViewDir, 'config', 'config-' + self.viewName + '.less');
    var _param = self.viewParam[0];

    file.editLessFile(
        'preview',
        _lessViewConfigFile,
        'config-' + self.viewName + '.less',
        _param,
        function(err, result){
            self.viewCallback(err, result);
        }
    );
}

Config.prototype.editPublish = function(){
    var self = this;
    var _lessPubConfigFile = path.join(self.lessPubDir, 'config', 'config-' + self.viewName + '.less');
    var _param = self.viewParam[0];

    file.editLessFile(
        'publish',
        _lessPubConfigFile,
        'config-' + self.viewName + '.less',
        _param,
        function(err, result){
            self.viewCallback(err, result);
        }
    );
}

Config.prototype.resetConfig = function(){
    var self = this;
    var _lessDefConfigFile = path.join(self.lessDefDir, 'config', 'config-' + self.viewName + '.less');

    file.editLessFile(
        'default',
        _lessDefConfigFile,
        'config-' + self.viewName + '.less',
        {},
        function(err, result){
            self.viewCallback(err, result);
        }
    );
}

Config.prototype.chooseType = function(doAll, doLess, doJs){
    var self = this;
    switch(self.editType){
        case 'all':
            typeof doAll == 'function' && doAll();
        break;
        case 'less':
            typeof doLess == 'function' && doLess();
        break;
        case 'js':
            typeof doJs == 'function' && doJs();
        break;
        default:
            throw 'config error';
        break;
    }
}








