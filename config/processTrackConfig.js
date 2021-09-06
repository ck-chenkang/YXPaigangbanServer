let app = {
    user: 'sa',            //用户名
    password: 'ck123456', //密码
    server: '192.168.13.33',   //服务器
    database: 'ORGATEX',  //数据库
    port: 1433,            //端口默认不用改
    options: {
    encrypt: false // Use this if you're on Windows Azure，如果不是亚马逊云的话，就关掉它
    },
    pool: {
        min: 0,
        max: 10,
        idleTimeoutMillis: 3000
    }
  };
   
  module.exports = app;