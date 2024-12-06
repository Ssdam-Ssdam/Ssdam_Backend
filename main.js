const express = require("express");
const { sequelize } = require('./models'); // sequelize 객체 가져오기
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
const port = process.env.PORT;

//* DB connection & sync
sequelize
    .sync({ force: false }) //true면 서버 재시작 시 테이블 삭제 후 재생성
    .then(() => {
    	console.log('db connection success...!');
    })
    .catch(err => {
    	console.error(err);
    });

app.use(express.json()); // JSON 형식의 body 파싱
app.use(bodyParser.urlencoded({ extended: false }));

// 정적 파일 폴더 지정
app.use(express.static('public'));

// router
var userRouter = require('./router/userRouter');
var inquiryRouter = require('./router/inquiryRouter');
var larWasteRouter = require('./router/larWasteRouter');
var personRouter = require('./router/personRouter');
var adminRouter = require('./router/adminRouter');

// routing
app.use('/user', userRouter);
app.use('/inquiry', inquiryRouter);
app.use('/lar-waste', larWasteRouter);
app.use('/person', personRouter);
app.use('/admin', adminRouter);

app.listen(port,()=>{ //실행 시 npm run dev 입력하면 파일 수정 시 서버 자동 재시작
    console.log(`Server is listening on ${port}`);
});
