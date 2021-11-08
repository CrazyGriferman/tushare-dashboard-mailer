const nodemailer = require("nodemailer");
//var path = require("path");
var express = require("express");
//var webpack = require("webpack");
var bodyParser = require("body-parser");
var app = express();
var apiRoutes = express.Router();

// Use Smtp Protocol to send Email

app.listen(8085, function () {
  console.info("复制打开浏览器", "localhost:8085");

  let transporter = nodemailer.createTransport({
    service: "QQ",
    auth: {
      user: "251031557@qq.com", // TODO: your gmail account
      pass: "domvadrtufwibhae", // TODO: your gmail password
    },
  });

  // setup e-mail data with unicode symbols
  let mailOptions = {
    from: "251031557@qq.com", // TODO: email sender
    to: "251031557@qq.com", // TODO: email receiver
    subject: "test",
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return console.log("Error occurs");
    }
    return console.log("Email sent!!!");
  });
});

/* // Step 1
let transporter = nodemailer.createTransport({
        service: "QQ",
        auth: {
          user: "251031557@qq.com", // TODO: your gmail account
          pass: "domvadrtufwibhae", // TODO: your gmail password
        },
      });

// Step 2

let mailOptions = {
        from: "251031557@qq.com", // TODO: email sender
        to: "251031557@qq.com", // TODO: email receiver
      };

// Step 3
transporter.sendMail(mailOptions, (err) => {
        if (err) {
          return console.log("Error occurs");
        }
        return console.log("Email sent!!!");
      });

const mail = {
  sendMail: function (ob = {}) {
    console.log(1);
    transporter.sendMail({ ...mailOptions, ...ob }, (err) => {
      err && console.log(err);
    });
  },
};

module.exports = mail; */
