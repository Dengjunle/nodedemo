var express = require('express');
var fs = require("fs");
var router = express.Router();

const {success,fail} = require("../utils/response");

// 引入上传模块
var multer = require("multer");
// 配置上传对象
var upload = multer({dest:"./public/upload"});

// 处理表上传post请求
/**
 * 上传文件
 * @route POST /upload
 * @group 上传文件
 * @param {file} file.formData.required
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post('/',upload.single("file"), function(req, res, next) {
    // 因为上传的文件的名字为随机名字，可以重新命名
    let oldPath = req.file.destination+"/"+req.file.filename;
    let newPath = req.file.destination+"/"+req.file.filename+req.file.originalname;
    fs.rename(oldPath,newPath,()=>{
        console.log("改名成功")
    })
    res.send(success({imgPath:req.file.filename+req.file.originalname},"上传成功"))
});

module.exports = router;



// 如果上传单个文件，可调用upload.single()方法，并且将表单文件的name值传入
/**
 * @typedef Point
 * @property {integer} x.required
 * @property {integer} y.required - Some description for point - eg: 1234
 * @property {string} color
 * @property {enum} status - Status values that need to be considered for filter - eg: available,pending
 */
/**
 * @typedef Test
 * @property {integer} x.required
 * @property {integer} y.required - Some description for point - eg: 1234
 * @property {string} color
 * @property {Array.<Point>} obj
 * @property {[integer]} bbb
 * @property {enum} status - Status values that need to be considered for filter - eg: available,pending
 */
//  * @param {Test.model} test.body.required - poionss
