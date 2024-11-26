const User = require('../models/User'); //user 테이블 객체 불러오기
const jwt = require('jsonwebtoken'); //토큰 모듈

const ACCESS_KEY = `access_secret_key`;

const login = async (req, res) => {
    const { userId, password } = req.body;

    try {
        const user = await User.findOne({ //user 테이블에서 하나의 레코드 찾기
            where: {
                userId: userId, //user 테이블에서 userId가 userId인 값 찾기
                password: password //user 테이블에서 password가 password인 값 찾기
            }
        })

        if(!user) { // 로그인 실패
            return res.status(401).json({ //Unauthorized
                "message": "The ID or password does not match."
            })
        } else { // 로그인 성공
            try{
                const userInfo = user.dataValues;
                // 토큰 발급
                const accessToken = jwt.sign(
                    userInfo, // 첫 번째 인자는 객체 형식으로 전달해야 한다
                    ACCESS_KEY, {
                        expiresIn: '7d', // 토큰 유효 기간
                        issuer: 'ssdam' // 토큰 발급 주체
                    }
                );

                // 응답 시 Authorization header에 token 설정 후 client로 전송
                res.set('Authorization', 'Bearer' + accessToken);

                res.status(200).json({
                    "message": "login success",
                    "token": accessToken,
                    "userName": user.userName
                })
            } catch(error) {
                console.log(`error: ${error}`);
                res.status(500).json({
                    "error": error,
                    "message": "Internal Server Error"
                })
            }
        }
    } catch(err) {
        console.log(`error: ${err}`);
        res.status(500).json({
            "error": err,
            "message": "Internal Server Error"
        })
    }
}

const register = (req, res) => {
    const { userId, password, name, email, region, sub_region, street, detail_address, zonecode } = req.body;

    User.create({
        userId: userId,
        password: password,
        userName: name,
        userEmail: email
    })
    .then(user => {
        res.status(200).json({
            "message": "register success"
        })
    })
    .catch(err => {
        console.log(`error: ${err}`);
        res.status(500).json({
            "error": err,
            "message": "Internal Server Error"
        })
    })
}

module.exports = {
    login,
    register
}