//引入express框架
const express = require('express');
//路径处理模块
const path = require('path');
//创建web服务器
const app = express();
const formidable = require('formidable'); 
//静态资源访问功能
app.use(express.static(path.join(__dirname, 'nodejs')));

app.get('/first',(req,res) => {
    res.send('fuck');
});
 

//静态资源访问服务功能
app.use(express.static(path.join(__dirname, 'severest')));

app.get('/first',(req,res) => {
    res.send('hello ajax');
})

app.post('/upload',(req,res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname,'image');
    form .parse(req,(err,fields,files)=>{
        res.send('ok');
    })
})


//监听端口
app.listen(8080);
//控制台提示输出
console.log('服务器启动成功');