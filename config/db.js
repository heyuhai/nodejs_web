//数据操作库
var mysql = require('mysql');
var config = require('./common_config');
config = new config();
var db_host = config.db_host;
var db_user = config.db_user;
var db_password = config.db_password;
var db_port = config.db_port;
var db_database = config.db_database;
var db_prefix = config.db_prefix;

function db() {

    this.connectDb = null;

    //数据库连接
    this.connectServer = function(){
        var connection = mysql.createConnection({
            host     : db_host,
            user     : db_user,
            password : db_password,
            port: db_port,
            database: db_database
        });
        if (this.connectDb) {
            return this.connectDb;
        }
        this.connectDb = connection;
        return connection;
    };
    //表
    this.table = function(table){
        return db_prefix+table;
    };
    //查询数据
    this.fetch = function(sql, callback){
        connection = this.connectServer();
        // connection.connect();
        connection.query(sql, function(err, result){
            if(err){
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            callback(result);
        });
        // connection.end();
    };
    //插入数据
    this.insert = function(table, data, callback){
        connection = this.connectServer();

        table = this.table(table);
        var fields = '';
        var values = '';
        var params = [];
        for(var key in data){
            fields += key+',';
            values += '?,';
            params.push(data[key]);
        }
        if(fields != '') fields = fields.substring(0, fields.length-1);
        if(values != '') values = values.substring(0, values.length-1);

        var sql = 'INSERT INTO '+table+' ('+fields+') VALUES ('+values+')';
        connection.query(sql, params, function(err, result){
            if(err){
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            callback(result.insertId);
        });
    };
    //更改数据
    this.update = function(table, data, where, callback){
        connection = this.connectServer();

        table = this.table(table);
        var fields_values = '';
        var params = [];
        for(var key in data){
            fields_values += key+'=?,';
            params.push(data[key]);
        }
        if(fields_values != '') fields_values = fields_values.substring(0, fields_values.length-1);
        if(where != '') where = ' WHERE '+where;
        var sql = 'UPDATE '+table+' SET '+fields_values+where;
        connection.query(sql, params, function(err, result){
            if(err){
                console.log('[UPDATE ERROR] - ', err.message);
                return;
            }
            callback(result.affectedRows);
        });
    };
    //删除数据
    this.delete = function(table, where, callback){
        connection = this.connectServer();

        table = this.table(table);
        if(where != '') where = ' WHERE '+where;
        var sql = 'DELETE FROM '+table+where;
        connection.query(sql, function(err, result){
            if(err){
                console.log('[DELETE ERROR] - ', err.message);
                return;
            }
            callback(result.affectedRows);
        });
    };
};

module.exports = db;
