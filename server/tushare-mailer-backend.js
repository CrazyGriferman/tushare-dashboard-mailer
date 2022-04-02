// required to create a config file to add stockApi / mailAccount / mailPassWord
const config = require("./config/config");

const nodemailer = require("nodemailer");
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const Axios = require("axios");

/* new Date()  to yyyymmdd */
const dateFormat = (time) => {
  var date = new Date(time);
  var year = date.getFullYear();
  var month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  // 拼接
  return year + "" + month + "" + day;
};

// file module
const fs = require("fs");

function jsonReader(filePath, cb) {
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      return cb && cb(err);
    }
    try {
      const object = JSON.parse(fileData);
      return cb && cb(null, object);
    } catch (err) {
      return cb && cb(err);
    }
  });
}

const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use("/", router);

// Use Smtp Protocol to send Email

let transporter = nodemailer.createTransport({
  service: "QQ",
  auth: {
    // add your own mail account and password
    user: config.mailUserName,
    pass: config.mailPassWord,
    // domvadrtufwibhae opcatfmlkmhebhca
  },
});

app.post("/add", (req, res) => {
  const data = req.body.data;
  jsonReader("./stock.json", (err, subscriptionInfo) => {
    if (err) {
      console.log(err);
      return;
    }
    subscriptionInfo.push(data);
    fs.writeFile("./stock.json", JSON.stringify(subscriptionInfo), (err) => {
      if (err) console.log("Error writing file:", err);
    });
  });
});

app.post("/delete", (req, res) => {
  const data = req.body.data;
  jsonReader("./stock.json", (err, subscriptionInfo) => {
    if (err) {
      console.log(err);
      return;
    }
    subscriptionInfo.forEach((item) => {
      if (item.stockName == data.stockName && item.mail == data.mail) {
        const index = subscriptionInfo.indexOf(item);
        function removeItemWithSlice(items, index) {
          const firstArr = items.slice(0, index);
          const secondArr = items.slice(index + 1);
          return [...firstArr, ...secondArr];
        }
        subscriptionInfo = removeItemWithSlice(subscriptionInfo, index);
      }
    });
    fs.writeFile("./stock.json", JSON.stringify(subscriptionInfo), (err) => {
      if (err) console.log("Error writing file:", err);
    });
  });
});

const fetchDailyStockInfo = (ts_code, trade_data) => {
  return Axios.default.post("http://api.waditu.com/", {
    api_name: "daily",
    // add your own token
    token: config.tushareToken,
    params: {
      ts_code: ts_code,
      trade_date: trade_data,
    },
    fields: "close",
  });
};

const sendMail = () => {
  jsonReader("./stock.json", (err, subscriptionInfo) => {
    if (err) {
      return;
    }
    const hours = new Date().getHours();
    if (hours == 18) {
      const date = dateFormat(new Date());
      subscriptionInfo.forEach((item) => {
        /* 首先遍历每个订阅信息，对于每个订阅信息，它是一个对象，
         调用函数fetchDailyStockInfo获取股票收盘价格，将该收盘价格与用户订阅的价格相对比
         这里有个细节就是假如当天闭市的话，通过api获取的价格为undefined，因而在对比的需要先判断currentPrice是否被定义
         ，不然就会发过来空价格的邮件
        */
        fetchDailyStockInfo(item.stockNumber, date).then((res) => {
          let currentPrice = res.data.data.items;
          // need to check the length of currentPrice(an array)
          if (currentPrice.length != 0 && currentPrice < item.stockPrice) {
            let mailOptions = {
              from: config.mailUserName, // TODO: email sender
              to: item.mail, // TODO: email receiver
              subject: `${item.stockName} 股价提醒`,
              text: `当前${item.stockName}为${currentPrice} , 已小于您订阅的价格${item.stockPrice}`,
            };
            transporter.sendMail(mailOptions, (err) => {
              if (err) {
                return console.log(err);
              }
              res.send("mail send");
              return console.log("Email sent!!!");
            });
          }
        });
      });
    }
  });
};

/* 3600000 1hour */
app.listen(8085, function () {
  console.info("复制打开浏览器", "localhost:8085");
  setInterval(sendMail, 3600000);
});
