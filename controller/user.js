const User = require('../models/User'); //user 테이블 객체 불러오기
const Address = require('../models/Address'); // address 테이블 객체 불러오기
const Classified_images = require('../models/Classified_images');
const Feedback = require('../models\/Feedback');
const Waste_fees = require('../models/Waste_fees');
const jwt = require('jsonwebtoken'); //토큰 모듈
const {sequelize} = require('../models');
const { Op, Sequelize } = require('sequelize');

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
                message: "The ID or password does not match."
            })
        } else { // 로그인 성공
            try{
                const userInfo = user.dataValues;
                // 토큰 발급
                const accessToken = jwt.sign(
                    userInfo, // 첫 번째 인자는 객체 형식으로 전달해야 한다
                    process.env.ACCESS_KEY, {
                        expiresIn: '7d', // 토큰 유효 기간
                        issuer: 'ssdam' // 토큰 발급 주체
                    }
                );

                // 응답 시 Authorization header에 token 설정 후 client로 전송
                res.set('Authorization', 'Bearer ' + accessToken);

                res.status(200).json({
                    message: "login success",
                    token: accessToken,
                    name: user.userName
                })
            } catch(error) {
                console.log(`error: ${error}`);
                res.status(500).json({
                    error: error,
                    message: "Internal Server Error"
                })
            }
        }
    } catch(err) {
        console.log(`error: ${err}`);
        res.status(500).json({
            error: err,
            message: "Internal Server Error"
        })
    }
}

const register = async (req, res) => {
    const { userId, password, name, email, region, sub_region, street, detail_address, zonecode } = req.body;

    const t = await sequelize.transaction(); // 트랜잭션 시작
    try {
        // 1. User 테이블에 데이터 삽입
        const user = await User.create(
            {
                userId: userId,
                password: password,
                userName: name,
                userEmail: email
            },
            { transaction: t } // 트랜잭션 사용
        );

        // 2. Address 테이블에 데이터 삽입
        await Address.create(
            {
                userId: user.userId, // User의 userId와 연결
                region: region,
                sub_region: sub_region,
                street: street,
                detail_address: detail_address,
                zonecode: zonecode
            },
            { transaction: t } // 트랜잭션 사용
        );

        await t.commit(); // 성공 시 트랜잭션 커밋
        res.status(200).json({
            message: "register success"
        });
    } catch (err) {
        await t.rollback(); // 오류 발생 시 롤백
        console.error(`error: ${err}`);
        res.status(500).json({
            error: err,
            message: "Internal Server Error"
        });
    }
};

const user_delete = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await User.destroy({
            where: {
                userId: userId
            }
        })

        if(!user){
            res.status(404).json({
                message: "user not found"
            })
        } else {
            res.status(200).json({
                message: "user deleted successfully"
            })
        }
    } catch(err) {
        console.log(`error: ${err}`);
        res.status(500).json({
            error: err,
            message: "Internal Server Error"
        })
    }
}

const profile = async (req, res) => {
    const userId = req.userId;

    try {
        const t = await sequelize.transaction();

        const user = await User.findOne({
            where: {
                userId: userId
            }
        }, {
            transaction: t
        });

        const address = await Address.findOne({
            where: {
                userId: userId
            }
        }, {
            transaction: t
        });

        await t.commit();

        var sim_address = '';
        var full_address = '';

        if (address.region) {
            sim_address += address.region + ' ';
            full_address += address.region + ' ';
        }
    
        if (address.sub_region) {
            sim_address += address.sub_region + ' ';
            full_address += address.sub_region + ' ';
        }
    
        if (address.street) {
            full_address += address.street + ' ';
        }
    
        if (address.detail_address) {
            full_address += address.detail_address;
        }
    
        // 공백을 마지막에 하나만 남기도록 처리
        sim_address = sim_address.trim();
        full_address = full_address.trim();

        res.status(200).json({
            message: "user information call successful",
            userId: user.userId,
            password: user.password,
            name: user.userName,
            email: user.userEmail,
            sim_address: sim_address,
            address: full_address

        })

        // var full_address = '';

        // if (address.region) {
        //     full_address += address.region + ' ';
        // }

        // if (address.sub_region) {
        //     full_address += address.sub_region + ' ';
        // }

        // // 공백을 마지막에 하나만 남기도록 처리
        // full_address = full_address.trim();

        // res.status(200).json({
        //     message: "profile read successfully",
        //     userId: user.userId,
        //     name: user.userName,
        //     sim_address: full_address
        // })
    } catch(err) {
        console.log(`error: ${err}`);
        res.status(500).json({
            error: err,
            message: "Internal Server Error"
        })
    }
}

const profile_update = async (req, res) => {
    const userId = req.userId;

    try {
        const t = await sequelize.transaction();

        const user = await User.findOne({
            where: {
                userId: userId
            }
        }, {
            transaction: t
        });

        const address = await Address.findOne({
            where: {
                userId: userId
            }
        }, {
            transaction: t
        });

        await t.commit();

        var sim_address = '';
        var full_address = '';

        if (address.region) {
            sim_address += address.region + ' ';
            full_address += address.region + ' ';
        }
    
        if (address.sub_region) {
            sim_address += address.sub_region + ' ';
            full_address += address.sub_region + ' ';
        }
    
        if (address.street) {
            full_address += address.street + ' ';
        }
    
        if (address.detail_address) {
            full_address += address.detail_address;
        }
    
        // 공백을 마지막에 하나만 남기도록 처리
        sim_address = sim_address.trim();
        full_address = full_address.trim();

        res.status(200).json({
            message: "user information call successful",
            userId: user.userId,
            password: user.password,
            name: user.userName,
            email: user.userEmail,
            sim_address: sim_address,
            address: full_address

        })
    } catch(err) {
        console.log(`error: ${err}`);
        res.status(500).json({
            error: err,
            message: "Internal Server Error"
        })
    }
}

const profile_update_process = async (req, res) => {
    const org_userId = req.userId;
    const { userId, password, name, email, region, sub_region, street, detail_address, zonecode } = req.body;

    try {
        const t = await sequelize.transaction();

        await User.update({
            userId: userId,
            password: password, 
            userName: name,
            userEmail: email
        }, {
            where: {
                userId: org_userId
            }
        }, {
            transaction: t
        });

        await Address.update({
            region: region,
            sub_region: sub_region,
            street: street,
            detail_address: detail_address,
            zonecode: zonecode
        }, {
            where: {
                userId: userId
            }
        }, {transaction: t

        });

        await t.commit();

        const user = await User.findOne({
            where: {
                userId: userId
            }
        })

        const address = await Address.findOne({
            where: {
                userId: userId
            }
        })

        var full_address = '';

        if (address.region) {
            full_address += address.region + ' ';
        }

        if (address.sub_region) {
            full_address += address.sub_region + ' ';
        }

        // 공백을 마지막에 하나만 남기도록 처리
        full_address = full_address.trim();

        res.status(200).json({
            message: "user information updated successfully",
            userId: user.userId,
            password: user.password,
            name: user.userName,
            email: user.userEmail,
            address: full_address
        })
    } catch(err) {
        console.log(`error: ${err}`);
        res.status(500).json({
            error: err,
            message: "Internal Server Error"
        })
    }
}

const history = async (req, res) => {
    const userId = req.userId;

    try {
        const t = await sequelize.transaction();

        const all_images = await Classified_images.findAll({
            where: {
                userId: userId
            },
            transaction: t
        });

        const address = await Address.findOne({
            where: {
                userId: userId
            }
        }, {
            transaction: t
        })

        await t.commit();

        // 객체 변환
        const all_images_plain = all_images.map(image => image.get({ plain: true }));

        for (let i of all_images_plain) {
            let feedback = await Feedback.findOne({
                where: {
                    imgId: i.imgId
                }

            })

            if(feedback && !feedback.is_good){
                i.waste_name = feedback.waste_name;
            }
       }

       for (let i = 0 ; i < all_images.length ; i++){
            const wastes = await Waste_fees.findAll({
                where: {
                    [Sequelize.Op.and]: [
                      Sequelize.literal(
                        `REGEXP_REPLACE(waste_name, '\\(.*?\\)', '') LIKE '%${all_images_plain[i].waste_name}%'`
                      ),
                      {
                        region: address.region,
                        sub_region: address.sub_region
                      }
                    ]
                  }
            })
            console.log(`wastes: ${wastes[0].fee}`);

            // waste_fee를 배열로 저장
            all_images_plain[i].waste_fee = [];

            for(let j of wastes){
                all_images_plain[i].waste_fee.push({
                    waste_standard: j.waste_standard,
                    fee: j.fee
                });
            }
       }

       const history_data = all_images_plain;
        res.status(200).json({
            message: "user history get successfully",
            history_data
        })

    } catch(err) {
        console.log(`error: ${err}`);
        res.status(500).json({
            error: err,
            message: "Internal Server Error"
        });
    }
}

// 아이디 중복 확인
const checkDuplicateId = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findAll({
            where: {
                userId: userId
            }
        })

        var is_available = false;
        var message = `The userId is already taken.`
        if(user.length === 0) { // 아이디 설정 가능 
            is_available = true;
            message = `The userId is available.`;
        }

        res.status(200).json({
            is_available,
            message: message
        })
    } catch(err) {
        console.log(`error: ${err}`);
        res.status(500).json({
            error: err,
            message: "Internal Server Error"
        })
    }
}

module.exports = {
    login,
    register,
    user_delete,
    profile,
    profile_update,
    profile_update_process,
    history,
    checkDuplicateId
}