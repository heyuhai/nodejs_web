var express = require('express');
var router = express.Router();
//数据库操作
var db = require('../../config/db');
db = new db();
//公共方法
var common = require('../../config/common_function');
common = new common();

/* 后台登录页 */
router.get('/', function(req, res, next) {
    res.render('admin/index', { title: '管理后台' });
});

//账号登录
router.post('/login', function(req, res, next) {

    var username = req.body.username;
    var password = req.body.password;

    //判断账号密码是否正确
    var sql = 'SELECT * FROM '+db.table('user')+' WHERE username = "'+username+'" and password = "'+password+'" limit 1';

    db.fetch(sql, function(result){
        var response = {};
        if(result.length > 0){
            //保存session数据
            req.session.uid = result[0].id;
            req.session.uname = result[0].username;
            //登录成功
            response.result = 'success';
            response.code = '0001';
            // response.data = req.session.uid;
        }else{
            //账号密码错误或账号不存在
            response.result = 'defeat';
            response.code = '0011';
            response.reason = '账号密码错误或账号不存在';
        }
        res.end(JSON.stringify(response));
    });
});

/* 后台主页 */
router.get('/main', function(req, res, next) {
    var uid = '',
        uname = '';
    response = checkLogin(req, res);
    uid = response.uid;
    uname = response.uname;

    res.render('admin/main', { title: '管理后台首页', uname: uname });
});

/* 退出 */
router.get('/logout', function(req, res, next) {

    if(req.session.uid){
        delete req.session.uid;
        delete req.session.uname;
    }

    res.redirect('/admin');
});


//==================== 管理员模块 start ====================================================
/* 管理员列表 */
router.get('/user_list', function(req, res, next) {
    checkLogin(req, res);

    var sql = 'SELECT * FROM '+db.table('user');
    db.fetch(sql, function(result){
        res.render('admin/user_list', { title: '管理员列表', list: result });
    });
});

/* 管理员添加修改 页面 */
router.get('/user_add', function(req, res, next) {
    checkLogin(req, res);

    var id = '';
    if(req.query.id) id = req.query.id;

    if(id != ''){ //修改
        id = parseInt(id);
        var sql = 'SELECT * FROM '+db.table('user')+' WHERE id = '+id+' limit 1';
        db.fetch(sql, function(result){
            res.render('admin/user_add', { title: '管理员添加修改', id: id, info: result[0] });
        });
    }else{ //增加
        res.render('admin/user_add', { title: '管理员添加修改', id: id, info: '' });
    }
});

/* 管理员添加修改 操作 */
router.post('/user_add', function(req, res, next) {
    checkLogin(req, res);

    var id = '';
    if(req.body.id && req.body.id != '') id = req.body.id;

    var username = req.body.username;
    if(id != ''){ //修改
        id = parseInt(id);
        data = {};
        data.username = username;
        if(req.body.password != ''){
            data.password = req.body.password;
        }
        db.update('user', data, 'id = '+id, function(result){
            var response = {};
            if(result || result === 0){
                response.result = 'success';
                response.code = '0001';
                // response.data = result;
            }else{
                response.result = 'defeat';
                response.code = '0011';
                response.reason = '修改失败';
            }
            res.end(JSON.stringify(response));
        });
    }else{ //增加
        var password = req.body.password;
        var data = {
            'username': username,
            'password': password,
            'dateline': common.time
        };

        //判断账号是否存在
        var sql = 'SELECT username FROM '+db.table('user')+' WHERE username = "'+username+'" limit 1';
        db.fetch(sql, function(result){
            var response = {};
            if(result.length > 0){
                response.result = 'defeat';
                response.code = '0012';
                response.reason = '账号已存在';
                res.end(JSON.stringify(response));
            }else{
                db.insert('user', data, function(result_id){
                    var response = {};
                    if(result_id){
                        response.result = 'success';
                        response.code = '0001';
                    }else{
                        response.result = 'defeat';
                        response.code = '0011';
                        response.reason = '添加失败';
                    }
                    res.end(JSON.stringify(response));
                });
            }
        });
    }
});

/* 管理员删除 */
router.post('/user_del', function(req, res, next) {
    checkLogin(req, res);

    var ids = req.body.ids;
    if(ids == ''){
        var response = {};
        response.result = 'defeat';
        response.code = '0012';
        response.reason = '操作数据为空';
        res.end(JSON.stringify(response));
    }else{
        db.delete('user', 'id IN ('+ids+')', function(result){
            var response = {};
            if(result || result === 0){
                response.result = 'success';
                response.code = '0001';
            }else{
                response.result = 'defeat';
                response.code = '0011';
                response.reason = '删除失败';
            }
            res.end(JSON.stringify(response));
        });
    }
});
//==================== 管理员模块 end ====================================================


//==================== 文章模块 start ====================================================
/* 文章列表 */
router.get('/article_list', function(req, res, next) {
    checkLogin(req, res);

    res.render('admin/article_list', { title: '文章列表' });
});

/* 文章添加修改 */
router.get('/article_add', function(req, res, next) {
    checkLogin(req, res);

    res.render('admin/article_add', { title: '文章添加修改' });
});

/* 文章删除 */
router.get('/article_del', function(req, res, next) {
    checkLogin(req, res);

    res.redirect('/admin/article_list');
});
//==================== 文章模块 end ====================================================


//检查是否登录
function checkLogin(req, res){
    if(req.session.uid){
        uid = req.session.uid;
        uname = req.session.uname;
    }else{
        res.redirect('/admin');
    }

    return {uid: uid, uname: uname}
}

module.exports = router;
