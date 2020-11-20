var jwt = require("jsonwebtoken");
var signkey = 'mes_qdhd_mobile';//密匙

var {exceedTime} = require("./response");//401token响应格式

// 设置token
function setToken(userinfo){
    return new Promise((resolve,reject)=>{
        var token = jwt.sign({...userinfo},signkey,{
            // expiresIn:3 //3天后过期
            expiresIn:60*60*24*3 //3天后过期
        })
        resolve(token);
    })
}

// 验证token
function verToken(token){
    return new Promise((resolve,reject)=>{
        jwt.verify(token,signkey,(err,res)=>{
            if(err){
                reject(err)
            }else{
                resolve(res)
            }
        })
    })
}

// 判断是否token过期
function permisson(req,res,next){
    let {token} = req.headers;
    verToken(token).then((result)=>{
        next();
        console.log('result',result)
    }).catch((err)=>{
        res.send(exceedTime('登录已过期，请重新登录'));
        console.log('err',err)
    })
}

module.exports = {
    setToken,
    verToken,
    permisson
}