module.exports = {
  // devtool: 'none',
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8085", //the third-party interface you requested
        changeOrigin: true, // A virtual server is created locally, then the requested data is sent, and the requested data is received at the same time, so there are no cross-domain issues with data interaction between the server and the server
        pathRewrite: {
          // Path rewrite,
          "^/api": "", // Replace the request address in the target, that is, you can write directly to / API when you request the address http://api.douban.com/v2/XXXXX in the future.
        },
      },
      /* "/": {
        target: "http://api.waditu.com",
        changeOrigin: true,
      }, */
    },
  },
};
