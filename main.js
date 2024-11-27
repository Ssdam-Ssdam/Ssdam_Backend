const express = require("express");
const { sequelize } = require('./models'); // sequelize 객체 가져오기
const bodyParser = require('body-parser');
const app = express();

const PORT = 3000;

//* DB connection & sync
sequelize
    .sync({ force: false })
    .then(() => {
    	console.log('db connection success...!');
    })
    .catch(err => {
    	console.error(err);
    });

app.use(express.json()); // JSON 형식의 body 파싱
app.use(bodyParser.urlencoded({ extended: false }));

// router
var userRouter = require('./router/userRouter');
var inquiryRouter = require('./router/inquiryRouter');
var personRouter = require('./router/personRouter');

// routing
app.use('/user', userRouter);
app.use('/inquiry', inquiryRouter);
app.use('/person', personRouter);

app.listen(PORT,()=>{ //실행 시 npm run dev 입력하면 파일 수정 시 서버 자동 재시작
    console.log(`Server is listening on ${PORT}`);
});
