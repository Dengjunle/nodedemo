const mysql = require("mysql2");

const options = {
    host:"localhost",
    port:"3306",
    user:"root",
    password:"123456",
    database:"yygl"
}

// 创建与链接数据库
let con = mysql.createConnection(options);
// 建立连接
con.connect((err)=>{
    if(err){
        console.log("数据库连接异常",err)
    }else{
        console.log("数据库连接成功")
    }
})

function sqlQuery(strSql,arr){
    return new Promise((resolve,reject)=>{
        con.query(strSql,arr,(err,result)=>{
            if(err){
                con.rollback();
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
}

function sqlQueryList(strSqlList){
    return new Promise((resolve,reject)=>{
        con.beginTransaction()
        strSqlList.forEach((item)=>{
            con.query(item.sql,item.arr,(err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        })
    })
}

function rollback(){
    con.rollback();
}

function commit(){
    con.commit();
}

function beginTransaction(){
    con.beginTransaction();
}

module.exports = sqlQuery