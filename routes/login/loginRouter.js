var express = require('express');
var router = express.Router();
// 引入token
let {setToken} = require("../../utils/token");
let sqlQuery = require("../../utils/mysql");
const {success,fail} = require("../../utils/response");
const {jiamiMd5} = require("../../utils/cropto");

/**
 * @typedef Register
 * @property {string} username.required
 * @property {string} password.required
 * @property {integer} roleid.required
*/

/**
 * 用户信息注册
 * @route GET /rl/register
 * @group 用户
 * @param {Register.model} register.body.required
 * @returns {object} 200 
 * @returns {Error}  default - Unexpected error
 */
router.post('/register',async function(req,res,next){
    let username = req.body.username;
    let password = req.body.password;
    let roleid = req.body.roleid;
    let sql = "select * from user where username = ?";
    let result = await sqlQuery(sql,[username]);
    if(result.length>0){
        res.send(fail(result,'用户已存在'));
    }else{
        let addSql = "insert into user (username,password,roleid) values(?,?,?)";
        let addResult = await sqlQuery(addSql,[username,jiamiMd5(password),roleid]);
        res.send(success(addResult,"注册成功"));
    }
})

async function menuRecursion(listId){
    let selRoleMenuSql = "select * from menu WHERE id in (?)";
    let selRoleMenuResult = await sqlQuery(selRoleMenuSql,[listId]);
    let menuList = [];
    let menuListId = [];
    for(let i=0;i<selRoleMenuResult.length;i++){
        menuList.push(selRoleMenuResult[i].menuurl);
        menuListId.push(selRoleMenuResult[i].id)
    }
    let pidMenuList = [];
    for(let i=0;i<selRoleMenuResult.length;i++){
        if(selRoleMenuResult[i].pid!=0&&menuListId.indexOf(selRoleMenuResult[i].pid)==-1){
            pidMenuList.push(selRoleMenuResult[i].pid)
        }
    }
    if(pidMenuList.length>0){menuList.push(...await menuRecursion(pidMenuList))}
    
    return menuList;
}

/**
 * @typedef Login
 * @property {string} username.required
 * @property {string} password.required
*/

/**
 * 用户信息登录
 * @route GET /rl/login
 * @group 用户
 * @param {Login.model} login.body.required - poionss
 * @returns {object} 200 
 * @returns {Error}  default - Unexpected error
 */
router.post('/login',async function(req,res,next){
    let {username,password} = req.body;
    let sql = "select id,username,mobile,imgheader,roleid from user where username = ? and password = ?";
    let result = await sqlQuery(sql,[username,jiamiMd5(password)]);
    
    if(result.length>0){
        let selRoleMenuSql = "select menuid from role_menu where roleid = ?";
    console.log(result[0])
    let selRoleMenuResult = await sqlQuery(selRoleMenuSql,[result[0].roleid]);
    let menuList = [];
    for(let i=0;i<selRoleMenuResult.length;i++){
        menuList.push(selRoleMenuResult[i].menuid);
    }
    menuList = await menuRecursion(menuList)
        let token = await setToken(result[0]);
        switch(result[0].roleid){
            case 0:
                result[0].role = ['USER'];
                break;
            case 1:
                result[0].role = ['ADMIN'];
                break;
            default: 
                result[0].role = ['USER'];
                break;
        }
        res.send(success({...result[0],token,menuList},"登录成功"));
    }else{
        res.send(fail(result,'账号或密码错误'));
    }
})

module.exports = router;
