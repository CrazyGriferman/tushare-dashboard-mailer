const nodemailer = require("nodemailer");
//var path = require("path");
let express = require("express");
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
const { default: axios } = require("axios");

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
    user: "251031557@qq.com", // TODO: your gmail account
    pass: "domvadrtufwibhae", // TODO: your gmail password
    // domvadrtufwibhae opcatfmlkmhebhca
  },
});

// setup e-mail data with unicode symbols

app.post("/post", (req, res) => {
  // const data = req.body.data;
  const data = req.body.data;
  let mailOptions = {
    from: "251031557@qq.com", // TODO: email sender
    to: data.mail, // TODO: email receiver
    subject: `上海机场数据`,
    text: `${data.sendText}`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return console.log(err);
    }
    res.send("mail send");
    return console.log("Email sent!!!");
  });
});

/* post */

app.get("/subscription", (req, res) => {
  jsonReader("./stock.json", (err, customer) => {
    if (err) {
      console.log(err);
      return;
    }
    res.send(customer);
  });
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

const timeFunc = setInterval(() => {
  let date = new Date();
  let h = date.getHours();
  if (h == 12) {
    sendEmail();
  }
}, 60000);

const fetchDailyStockInfo = (ts_code, trade_data) => {
  return Axios.default.post("http://api.waditu.com/", {
    api_name: "daily",
    token: "f65ba28a7e38e1aa626a720bfa27a7ce1a2d8b14216ad2fc1f44946d",
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
      console.log(err);
      return;
    }
    const hours = new Date().getHours();
    if (hours != 18) {
      const date = dateFormat(new Date());
      subscriptionInfo.forEach((item) => {
        fetchDailyStockInfo(item.stockNumber, date).then((res) => {
          let currentPrice = res.data.data.items;
          let mailOptions = {
            from: "251031557@qq.com", // TODO: email sender
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
        });
      });
    }
  });
};

/* 3600000 1hour */
app.listen(8085, function () {
  console.info("复制打开浏览器", "localhost:8085");
  setInterval();
});
