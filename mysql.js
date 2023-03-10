var mysql=require("mysql");
var pool = mysql.createPool({
    host: '119.3.71.222',
    user: 'root',
	password: 'admin123',
	port: '3306',
    database: 'managesys'
});

var query=function(sql,options,callback){

    pool.getConnection(function(err,conn){
        if(err){
            callback(err,null,null);
        }else{
            conn.query(sql,options,function(err,results,fields){
                //事件驱动回调
                callback(err,results,fields);
            });
            //释放连接，需要注意的是连接释放需要在此处释放，而不是在查询回调里面释放
            conn.release();
        }
    });
};

module.exports=query;