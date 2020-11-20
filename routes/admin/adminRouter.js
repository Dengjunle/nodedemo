var express = require('express');
var router = express.Router();

var usersRouter = require('./usersRouter');
var newsRouter = require('./newsRouter');
var doctorsRouter = require('./doctorsRouter');
var patientsRouter = require('./patientsRouter');

router.get('/', function(req, res, next) {
  res.send("进入后台");
});

// 后台用户管理模块
router.use('/users',usersRouter);

// 后台新闻管理
router.use('/news',newsRouter);

// 后台医生管理
router.use('/doctors',doctorsRouter);

// 后台患者管理
router.use('/patients',patientsRouter)



module.exports = router;
