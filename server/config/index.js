var path = require("path");

module.exports = {
  proxyTable: {
    "/api": {
      target: "http://localhost:8085", // 接口的域名
      // secure: false,  // 如果是https接口，需要配置这个参数
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      // pathRewrite: {
      //     '^/api': ''
      // }
    },
  },
};
