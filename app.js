
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , search = require('./routes/search')
  , http = require('http')
  , path = require('path')
  // 加入数据库
  , MongoStore = require('connect-mongo')(express)
  // 数据位置和名字的设置
  , settings = require('./settings');

var app = express();

app.configure(function(){
  // 设置端口为
  app.set('port', process.env.PORT || 3000);

  // 设置 views 文件夹为视图文件的目录，存放模板文件，__dirname 为全局变量，存储着当前正在执行脚本所在的目录名。
  app.set('views', __dirname + '/views');

  // 设置视图模版引擎为 ejs
  app.set('view engine', 'ejs');

  // connect 内建的中间件，使用默认的 favicon 图标
  app.use(express.favicon());

  // connect 内建的中间件，在开发环境下使用，在终端显示简单的不同颜色的日志
  app.use(express.logger('dev'));

  // connect 内建的中间件，用来解析请求体，支持 application/json， application/x-www-form-urlencoded, 和 multipart/form-data。
  app.use(express.bodyParser());

  // connect 内建的中间件，可以协助处理 POST 请求，伪装 PUT、DELETE 和其他 HTTP 方法。
  app.use(express.methodOverride());

  // Cookie 解析的中间件
  app.use(express.cookieParser());
  // 提供会话支持
  app.use(express.session({
    // secret 用来防止篡改 cookie
    secret: settings.cookieSecret,
    // key 的值为 cookie 的名字
    key: settings.db,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    store: new MongoStore({
      db: settings.db
    })
  }));

  // 设置应用的路由（可选），详细请参考：http://stackoverflow.com/questions/12695591/node-js-express-js-how-does-app-router-work
  app.use(app.router);

  // connect 内建的中间件，设置根目录下的 public 文件夹为静态文件服务器，存放 image、css、js 文件于此。
  app.use(express.static(path.join(__dirname, 'public')));

});

// 开发环境下的错误处理，输出错误信息。
app.configure('development', function(){
  app.use(express.errorHandler());
});

// 路由控制器，如果用户访问" / "路径，则由 routes.index 来控制
routes(app);
// app.get('/', routes.index);

// 通过 exports.index 导出 index 函数接口，
// app.get('/users', user.list);

// app.get('/login', routes.login);

// /search?order=desc&shoe[color]=blue&shoe[type]=converse 
// app.get('/search', search.query);


// 创建服务器并监听3000端口
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
