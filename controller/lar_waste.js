const Feedback = require('../models/Feedback');
const Waste_fees = require('../models/Waste_fees');
const Classified_images = require('../models/Classified_images');
const Address = require('../models/Address');
const { Op, Sequelize } = require('sequelize');
const {sequelize} = require('../models');

// middleware
const { getCoordinates, getClosestLocations } = require('../middlewares');

// child-process 사용 모듈
const { spawn } = require('child_process');

// fastapi 사용 모듈
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

const feedback = async (req, res) => {
    const userId = req.userId;
    const { imgId, is_good, waste_name } = req.body;

    try {
        const feedback = await Feedback.create({
            imgId: imgId,
            is_good: is_good,
            waste_name: waste_name,
            userId: userId
        });

        if(!feedback){
            res.status(500).json({
                message: "failed to insert feedback"
            })
        } else {
            res.status(200).json({
                message: "feedback saved successfully"
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

const search = async (req, res) => {
    const { waste_name } = req.query;
    const userId = req.userId;

    try {
        const t = await sequelize.transaction();

        const address = await Address.findOne({
            where: {
                userId: userId
            }
        }, {
            transaction: t
        })

        const wastes = await Waste_fees.findAll({
            where: {
                region: address.region,
                sub_region: address.sub_region.split(' ')[0],
                [Sequelize.Op.and]: [
                    Sequelize.where(
                        Sequelize.fn(
                            'REGEXP_REPLACE',
                            Sequelize.col('waste_name'),
                            '\\(.*?\\)', // 괄호와 그 안의 내용을 제거
                            '' 
                        ),
                        { [Sequelize.Op.like]: `%${waste_name}%` } // waste_name이 포함된 값 검색
                    )
                ]
            }, 
            transaction: t
        })

        await t.commit();

        console.log(`waste search length: ${wastes.length}`);
        res.status(200).json({
            message: "waste fee search successfully",
            wastes
        })
    } catch(err) {
        console.log(`error: ${err}`);
        res.status(500).json({
            error: err,
            message: "Internal Server Error"
        })
    }
}

const nearbyStores = async (req, res) => {
    const userId = req.userId;

    const area_data = {
        "경기": {
            "군포시": "./data/gyeonggido_gunposi.csv"
        },
        "인천": {
            "미추홀구": "./data/incheon_michuholgu.csv",
            "남동구": "./data/incheon_namdonggu.csv"
        },
        "대구": {
            "서구": "./data/daegu_seogu.csv"
        }
      }

    try {
        const address = await Address.findOne({
            where: {
                userId: userId
            }
        })

        const targetKey = Object.keys(area_data[address.region]).find((key) =>
            address.sub_region.includes(key)
          );

        // CSV 파일 경로 추출
        const csvFilePath = targetKey ? area_data[address.region][targetKey] : null;

        if(!csvFilePath){
            res.status(400).json({
                message: "A map of the area is still being prepared."
            })
        } else {
            const { latitude, longitude } = await getCoordinates(address.full_address);

            const locations = await getClosestLocations(address.full_address, csvFilePath);

            // 사용자의 주소 좌표 변경 결과
            console.log(`lat: ${latitude}, lon: ${longitude}`);
            res.status(200).json({
                user_lat: latitude,
                user_lon: longitude,
                locations
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

const upload_img = async (req, res) => {
    const userId = req.userId;
    let file = '/img/' + req.file.filename;

    // select1. fastapi
    try {
        const imagePath = path.join(__dirname, '../public/img', req.file.filename);
        const image = fs.createReadStream(imagePath);  // 이미지 파일 스트림
    
        const form = new FormData();
        form.append('file', image);
    
        const response = await axios.post(`http://${process.env.HOST}:8000/predict`, form, { // 배포시 파이썬 서버 주소로 변경
            headers: {
                ...form.getHeaders()
            }
        });
    
        const { predicted_class, entropy } = response.data;
        
        const img = await Classified_images.create({
            file_path: file,
            waste_name: predicted_class,
            accuracy: entropy,
            userId: userId
        })

        const address = await Address.findOne({
            where: {
                userId: userId
            }
        })
        if(!address){
            res.status(404).json({
                message: "user address is not existed"
            })
        }

        const waste_fees = await Waste_fees.findAll({
            where: {
                region: address.region,
                sub_region: address.sub_region.split(' ')[0],
                [Sequelize.Op.and]: [
                  Sequelize.where(
                    Sequelize.fn(
                      'REGEXP_REPLACE',
                      Sequelize.col('waste_name'),
                      '\\(.*?\\)',
                      '' // 괄호와 그 안의 내용을 공백으로 대체
                    ),
                    img.waste_name // 정확히 일치하는 이름만 검색
                  )
                ]
              }
            
          });
        console.log(`waste_fees: ${waste_fees}`);
    
        res.status(200).json({
            message: "success",
            imgId: img.imgId,
            waste_name: img.waste_name,
            accuracy: img.accuracy,
            image: img.file_path,
            waste_fees
        });
    } catch(err) {
        console.log(`error: ${err}`);
        res.status(500).json({
            error: err,
            message: "Internal Server Error"
        })
    }
    
    // select2. child-process 모듈
    // const image_pth = path.join(__dirname, '../public/img', req.file.filename);
    // const python_path = path.join(__dirname, '../ai_data/return_prediction_entropy_v6.py');

    // const result = spawn('python', [python_path, image_pth]);

    // result.stdout.on('data', async (data) => {
    //     // 1. data를 문자열로 변환
    //     let dataString = data.toString().replace(/\r\n/g, ''); // \r\n 제거

    //     // 2. JSON.parse를 사용하여 JavaScript 객체로 변환
    //     let dataObject = JSON.parse(dataString);

    //     // 3. 역슬래시(\) 제거
    //     if (typeof dataObject.predicted_class === 'string') {
    //         dataObject.predicted_class = dataObject.predicted_class.replace(/\\/g, '');
    //     }

    //     console.log(`Processed data: ${JSON.stringify(dataObject)}`);
    //     console.log(`pre: ${dataObject.predicted_class}`);
    //     console.log(`entr: ${dataObject.entropy}`);

    //     const img = await Classified_images.create({
    //         file_path: file,
    //         waste_name: dataObject.predicted_class,
    //         accuracy: dataObject.entropy,
    //         userId: userId
    //     })

    //     // 4. 클라이언트로 응답
    //     res.status(200).json({
    //         message: "success",
    //         imgId: img.imgId,
    //         waste_name: img.waste_name,
    //         accuracy: img.accuracy,
    //         image: img.file_path
    //     });
    // });

    // result.stderr.on('data', (data) => {
    //     console.error(`stderr: ${data}`);
    // });

}

module.exports = {
    feedback,
    search,
    nearbyStores,
    upload_img
}
