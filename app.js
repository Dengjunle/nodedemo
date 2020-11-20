var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const {permisson} = require("./utils/token");

// 引入跨域模块
const cors =require('cors');
// 引入session模块
var session = require('express-session');

var indexRouter = require('./routes/index');//前台页面
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin/adminRouter');//前台页面
var loginRouter = require('./routes/login/loginRouter');//登录注册页面
var uploadRouter = require('./routes/upload');//上传文件路由

var app = express();

// 配置swagger
const swagger = require("./swagger/index");
const expressSwagger = require('express-swagger-generator')(app);
expressSwagger(swagger)

//配置ajax跨域请求
app.use(cors({
  origin:"*",
  credentials:true   //每次登陆都验证跨域请求,要不会每次报跨域错误
}));

//express视图配置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// express中间件
app.use(session({
  secret:"5s6d4f56asd4f56as",
  resave:true,//强制保存
  cookie:{
    maxAge:7*24*60*60*1000//有效期为7天
  },
  saveUninitialized:true,//是否保存初始化的配置
}))

//日志文件
app.use(logger('dev'));

// 解析post
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 路由配置
app.use('/', indexRouter);
app.use('/user',permisson, usersRouter);
app.use('/admin',permisson,adminRouter);
app.use('/upload',permisson,uploadRouter);
app.use('/rl',loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
