var express = require('express');
var router = express.Router();

var sqlQuery = require("../../utils/mysql");
const {verToken} = require("../../utils/token");
const {jiamiMd5} = require("../../utils/cropto");
const {success,fail} = require("../../utils/response");

/**
 * @typedef User
 * @property {string} imgheader.required
 * @property {string} mobile.required
 * @property {string} password.required
*/

/**
 * 用户信息修改
 * @route POST /admin/users/userinfo
 * @group 管理员
 * @param {User.model} user.body.required - poionss
 * @returns {object} 200 
 * @returns {Error}  default - Unexpected error
 */
router.post("/userinfo",async function(req,res,next){
  let {mobile,password,imgheader} = req.body;
  let userinfo = await verToken(req.headers.token);
  let sql = 'select id,username,mobile,imgheader,roleid from user where id = ?';
  let result = await sqlQuery(sql,[userinfo.id]);
  if(result.length>0){
    let updateSql = 'update user set password=?, mobile=?, imgheader=? where id = ?';
    let uResult = await sqlQuery(updateSql,[jiamiMd5(password),mobile,imgheader,userinfo.id]);
    res.json(success(result[0],'修改成功'))
  }else{
    res.send(fail('','修改失败'))
  }
})

/**
 * 用户列表
 * @route GET /admin/users/userlist - 用户列表
 * @group 管理员
 * @param {string} page.query.required - 页数
 * @param {string} limit.query.required - 一页的数量
 * @returns {object} 200 
 * @returns {Error}  default - Unexpected error
 */
router.get("/userlist",async function(req,res,next){
  let {page,limit} = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  console.log(req.query)
  let sql = 'select user.id,user.username,user.mobile,user.imgheader,user.roleid,role.name as rolename from user LEFT JOIN role ON user.roleid = role.id LIMIT ?,?';
  let result = await sqlQuery(sql,[(page-1)*limit,limit]);
  let countSql = 'SELECT COUNT(*)as count from user';
  let total = await sqlQuery(countSql)
  console.log('total',total)
  if(result.length>0){
    res.json(success({list:result,total:total[0].count},'查询成功'))
  }else{
    res.send(fail('','查询失败'))
  }
})

/**
 * 删除用户
 * @route DELETE /admin/users/delete - 删除用户
 * @group 管理员
 * @param {integer} id.query.required - 用户id
 * @returns {object} 200 
 * @returns {Error}  default - Unexpected error
 */
router.delete("/delete",async function(req,res,next){
  console.log(req.body.user)
  req.body.user.forEach(async (id)=>{
    let sql = 'DELETE FROM user where id = ?';
    let result = await sqlQuery(sql,[id]);
  })
  res.json(success({},'删除成功'))
})

/**
 * @typedef EditUser
 * @property {string} imgheader.required
 * @property {string} mobile.required
 * @property {string} password.required
*/

/**
 * 更新用户
 * @route PUT /admin/users/edit
 * @group 管理员
 * @param {EditUser.model} user.body.required - poionss
 * @returns {object} 200 
 * @returns {Error}  default - Unexpected error
 */
router.put("/edit",async function(req,res,next){
  console.log("参数",req.body)
  let {roleid,mobile,imgheader,id} = req.body;
  let sql = 'update user set roleid=? , mobile=? , imgheader=? where id = ?';
  let result = await sqlQuery(sql,[roleid,mobile,imgheader,id]);
  res.json(success('','修改成功'));
})

/**
 * @typedef AddUser
 * @property {string} username.required
 * @property {string} imgheader.required
 * @property {string} mobile.required
 * @property {string} password.required
 * @property {integer} roleid.required
*/

/**
 * 添加用户
 * @route POST /admin/users/add
 * @group 管理员
 * @param {AddUser.model} user.body.required - poionss
 * @returns {object} 200 
 * @returns {Error}  default - Unexpected error
 */
router.post("/add",async function(req,res,next){
  let {username,password,roleid,mobile,imgheader} = req.body;
  let sql = 'select * from user where username = ?';
  let result = await sqlQuery(sql,[username]);
  if(result.length>0){
    res.json(fail('','添加失败，用户名已存在'))
  }else{
    let addSql = 'insert into user (username,password,roleid,mobile,imgheader) values (?,?,?,?,?)';
    await sqlQuery(addSql,[username,jiamiMd5(password),roleid,mobile,imgheader]);
    res.json(success('','添加成功'));
  }
})

/**
 * 获取身份
 * @route GET /admin/users/roles
 * @group 管理员
 * @returns {object} 200 
 * @returns {Error}  default - Unexpected error
 */
router.get("/roles",async function(req,res,next){
  let sql = 'select * from role';
  let result = await sqlQuery(sql);
  if(result.length>0){
    res.json(success(result,'查询成功'));
  }else{
    res.json(success([],'查询成功'));
  }
})

/**
 * 获取权限
 * @route GET /admin/users/auth
 * @group 管理员
 * @param {string} page.query.required - 页数
 * @param {string} limit.query.required - 一页的数量
 * @returns {object} 200 
 * @returns {Error}  default - Unexpected error
 */
router.get("/auth",async function(req,res,next){
  let {page,limit} = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  let sql = 'select * from auth limit ?,?';
  let result = await sqlQuery(sql,[(page-1)*limit,limit]);
  let countSql = 'SELECT COUNT(*)as count from auth';
  let total = await sqlQuery(countSql)
  if(result.length>0){
    res.json(success({list:result,total:total[0].count},'查询成功'));
  }else{
    res.json(success([],'查询成功'));
  }
})

/**
 * @typedef auth
 * @property {string} authname.required
 * @property {string} authurl.required
 * @property {integer} id
*/

/**
 * 添加权限
 * @route POST /admin/users/auth
 * @group 管理员
 * @param {auth.model} auth.body.required - poionss
 * @returns {object} 200 
 * @returns {Error}  default - Unexpected error
 */
router.post("/auth",async function(req,res,next){
  let {authname,authurl,id} = req.body;
  if(id){
    let sql = 'select * from auth where authname = ? and id != ?';
    let result = await sqlQuery(sql,[authname,id]);
    if(result.length>0){
      res.json(fail('','修改失败，权限名已存在'))
    }else{
      let sql = 'update auth set authname=?,authurl=? where id = ?';
      let result = await sqlQuery(sql,[authname,authurl,id]);
      res.json(success('','修改成功'));
    }
  }else{
    let sql = 'select * from auth where authname = ?';
    let result = await sqlQuery(sql,[authname]);
    if(result.length>0){
      res.json(fail('','添加失败，权限名已存在'))
    }else{
      let addSql = 'insert into auth (authname,authurl) values (?,?)';
      await sqlQuery(addSql,[authname,authurl]);
      res.json(success('','添加成功'));
    }
  }
})

/**
 * 删除权限
 * @route DELETE /admin/users/auth 
 * @group 管理员
 * @param {integer} id.query.required - 权限id
 * @returns {object} 200 
 * @returns {Error}  default - Unexpected error
 */
router.delete("/auth",async function(req,res,next){
  req.body.auth.forEach(async (id)=>{
    let sql = 'DELETE FROM auth where id = ?';
    let result = await sqlQuery(sql,[id]);
  })
  res.json(success({},'删除成功'))
})

/**
 * 获取角色
 * @route GET /admin/users/role
 * @group 管理员
 * @param {string} page.query.required - 页数
 * @param {string} limit.query.required - 一页的数量
 * @returns {object} 200 
 * @returns {Error}  default - Unexpected error
 */
router.get("/role",async function(req,res,next){
  let {page,limit} = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  // let sql = "select a.id,a.name,a.brief,CONCAT('[',GROUP_CONCAT(CONCAT(HEX(b.authid))),']')	as authList from role a LEFT JOIN role_auth b on a.id = b.roleid GROUP BY a.id limit ?,?";
  let sql = `select id, name ,brief,(select GROUP_CONCAT(authid)  from role_auth as ra WHERE ra.roleid = r.id GROUP BY r.id) as authMenu from role as r;`
  let result = await sqlQuery(sql,[(page-1)*limit,limit]);
  let countSql = 'SELECT COUNT(*)as count from role';
  let total = await sqlQuery(countSql)
  if(result.length>0){
    res.json(success({list:Array.from(result),total:total[0].count},'查询成功'));
  }else{
    res.json(success([],'查询成功'));
  }
})

/**
 * @typedef role
 * @property {string} authname.required
 * @property {string} authurl.required
 * @property {integer} id
*/

/**
 * 添加/编辑角色
 * @route POST /admin/users/role
 * @group 管理员
 * @param {role.model} role.body.required - poionss
 * @returns {object} 200 
 * @returns {Error}  default - Unexpected error
 */
router.post("/role",async function(req,res,next){
  let {authname,authurl,id} = req.body;
  if(id){
    let sql = 'select * from auth where authname = ? and id != ?';
    let result = await sqlQuery(sql,[authname,id]);
    if(result.length>0){
      res.json(fail('','修改失败，权限名已存在'))
    }else{
      let sql = 'update auth set authname=?,authurl=? where id = ?';
      let result = await sqlQuery(sql,[authname,authurl,id]);
      res.json(success('','修改成功'));
    }
  }else{
    let sql = 'select * from auth where authname = ?';
    let result = await sqlQuery(sql,[authname]);
    if(result.length>0){
      res.json(fail('','添加失败，权限名已存在'))
    }else{
      let addSql = 'insert into auth (authname,authurl) values (?,?)';
      await sqlQuery(addSql,[authname,authurl]);
      res.json(success('','添加成功'));
    }
  }
})

/**
 * 删除角色
 * @route DELETE /admin/users/role 
 * @group 管理员
 * @param {integer} id.query.required - 角色id
 * @returns {object} 200 
 * @returns {Error}  default - Unexpected error
 */
router.delete("/role",async function(req,res,next){
  req.body.auth.forEach(async (id)=>{
    let sql = 'DELETE FROM role where id = ?';
    let result = await sqlQuery(sql,[id]);
  })
  res.json(success({},'删除成功'))
})

module.exports = router;
