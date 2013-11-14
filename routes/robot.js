var file = require('../tools/file');
var Config = require('../tools/config');
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

exports.showView = function(req, res){
    res.render(
        'robot-iframe',
        {
            layout : 'scene-layout',
            title: '10000知道-机器人',
            headCss: ['/css/robot.css'],
            headJs : [] 
        }
    );
}

exports.readConfig = function(req, res){
    var _config = new Config.config({
        request : req,
        response : res,
        viewName : 'robot',
        viewParam : ['isChatBc', 'chatBc', 'isChatBg', 'chatBg', 'isChatRepeat'],
        viewCallback : function(data){
            // console.log(data);
            res.render(
                'robot',
                {
                    title : 'robot',
                    headCss : [],
                    headJs : [
                        '/js/cms/robot.js'
                    ],
                    chatColor: data.chatBc,
                    isChatBc : data.isChatBc,
                    isChatBg : data.isChatBg,
                    isChatRepeat : data.isChatRepeat
                }
            );
        }
    });
    _config.pageLoad();
};

exports.chat = function(req, res){
    var data = req.body;
    var actionType = data.actionType;
    var _config;
    if ( actionType == "default" ) {
        _config = new Config.config({
            request : req,
            response : res,
            viewName : 'robot',
            viewParam : [editData],
            viewCallback : function(err, result){
                // console.log(err, result);
                if ( err ) {
                    res.send(err);
                }else{
                    res.send(result);
                }
            }
        });
        _config.resetConfig();
        return false;
    }
    var isColor = data.isColor ? true : false;
    var colorValue = data.color;
    var isImage = data.isImage;
    var isRepeat = data.isRepeat;
    var image = req.files.image;
    var newImg = image ? 'config-robot-chat-bg.' + image.name.replace(/^.*\./gi, '') : 'i.gif';
    var editData = {
        'isChatBc' : 'true',
        'chatBc' : '#fff',
        'isChatBg' : 'false',
        'chatBg' : 'i.gif',
        'isChatRepeat' : 'false',
        'chatRepeat' : 'no-repeat center'
    };

    if ( isImage && image ) {
        editData['isChatBg'] = 'true';
        editData['chatBg'] =  '"' + newImg + '"';
        // 获得文件的临时路径
        var tmp_path = image.path;
        // 指定文件上传后的目录 - 示例为"images"目录。 
        var target_path = './public/images/tpls/' + newImg;
        // 移动文件
        fs.rename(tmp_path, target_path, function(err) {
            if (err) throw err;
            // 删除临时文件夹文件, 
            fs.unlink(tmp_path, function() {
                if (err) throw err;
            });
        });
    }else {
        editData['chatBg'] = 'i.gif';
    }

    if ( isRepeat ) {
        editData['isChatRepeat'] = 'true';
        editData['chatRepeat'] = 'repeat-x 0 0';
    }

    if ( isColor && colorValue ) {
        editData['isChatBc'] = 'true';
        editData['chatBc'] = colorValue;
    }

    _config = new Config.config({
        request : req,
        response : res,
        viewName : 'robot',
        viewParam : [editData],
        viewCallback : function(err, result){
            // console.log(err, result);
            if ( err ) {
                res.send(err);
            }else{
                res.send(result);
            }
        }
    });

    switch(actionType){
        case "preview":
            _config.editPreview();
        break;
        case "default":
        break;
        case "publish":
            _config.editPublish();
        break;
        default:
            throw '未知操作';
        break;
    }

    
};
