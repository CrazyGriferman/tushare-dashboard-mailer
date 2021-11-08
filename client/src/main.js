import Vue from "vue";
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  port: 465,
  secure: true,
  auth: {
    user: "251031557@qq.com", // 发送方的邮箱地址
    pass: "xwjfinrzncyeeacj",
  },
});
const info = {
  from: "251031557@qq.com",
  to: "2...@qq.com",
  subject: "subject",
  // text: "",
  // html: "<b>Hello world?</b>" // 和text只能选择一个
};
const mail = {
  sendMail: function (ob = {}) {
    transporter.sendMail({ ...info, ...ob }, (err) => {
      err && console.log(err);
    });
  },
};

module.exports = mail;
