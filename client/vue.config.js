module.exports = {
  //devtool: 'none',
  devServer: {
    proxy: {
      "/": {
        target: "http://localhost:8085",
        changeOrigin: true,
      },
    },
  },
};
