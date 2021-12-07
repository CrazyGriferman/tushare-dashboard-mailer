const nodemailer = require("nodemailer");
//var path = require("path");
let express = require("express");
//var webpack = require("webpack");server.js
const bodyParser = require("body-parser");
const router = express.Router();

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

// Listen on a specific host via the HOST environment variable
const host = process.env.HOST || "localhost";
// Listen on a specific port via the PORT environment variable
const port = process.env.PORT || 8086;

var cors_proxy = require("cors-anywhere");
cors_proxy
  .createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ["origin", "x-requested-with"],
    removeHeaders: ["cookie", "cookie2"],
  })
  .listen(port, host, function () {
    console.log("Running CORS Anywhere on " + host + ":" + port);
  });

// Use Smtp Protocol to send Email

let transporter = nodemailer.createTransport({
  service: "QQ",
  auth: {
    user: "251031557@qq.com", // TODO: your gmail account
    pass: "ycyucbxqdxnwcbah", // TODO: your gmail password
  },
});

// setup e-mail data with unicode symbols

app.listen(8085, function () {
  console.info("复制打开浏览器", "localhost:8085");
});

app.post("/test", (req, res) => {
  // const data = req.body.data;
  const data = req.body.data;

  let mailOptions = {
    from: "251031557@qq.com", // TODO: email sender
    to: "251031557@qq.com", // TODO: email receiver
    subject: `上海机场数据`,
    text: `${data}`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return console.log(err);
    }
    res.send("mail send");
    return console.log("Email sent!!!");
  });
});

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
  console.log(data);

  jsonReader("./stock.json", (err, subscriptionInfo) => {
    if (err) {
      console.log(err);
      return;
    }
    subscriptionInfo.map((item) => {
      console.log(item);
    });
    subscriptionInfo.push(data);
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
