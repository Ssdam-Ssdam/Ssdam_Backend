var express = require("express");
var app = express();
var port = 3000;

app.listen(port,()=>{
    console.log("서버 실행");
});
app.get("/", (req, res)=>{
    res.send("test");
})