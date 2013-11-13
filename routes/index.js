var robot = require("./robot");
/*
 * GET home page.
 */
// module.exports = function(app){
//     app.get('/', function(req, res){
//         res.render('index', { title: 'Express' });
//     });
// };
exports.index = function(req, res){
    res.render('index', { title: 'Express', head : '' });
};

// page robot

exports.robot = function(req, res){
    robot.readChatConfig(req, res);
};

// exports.robotBody = function(req, res){
//     res.render('robot-iframe', { title: 'Express' });
// };

// exports.robotChatBg = function(req, res){
//     robot.robotChatBg(req, res);
// };