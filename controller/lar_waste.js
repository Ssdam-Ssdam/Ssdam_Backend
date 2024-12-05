const Feedback = require('../models/Feedback');
const Waste_fees = require('../models/Waste_fees');
const Classified_images = require('../models/Classified_images');
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

    try {
        const wastes = await Waste_fees.findAll({
            where: {
                waste_name: waste_name
            }
        })

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

}

const upload_img = async (req, res) => {
    const userId = req.userId;
    let file = '/img/' + req.file.filename;

    // select1. fastapi
    try {
        const imagePath = path.join(__dirname, '../public/img', req.file.filename);
        // const imagePath = path.resolve(__dirname, '../input_bed.jpg');  // 이미지 파일 경로
        const image = fs.createReadStream(imagePath);  // 이미지 파일 스트림
    
        const form = new FormData();
        form.append('file', image);
    
        const response = await axios.post('http://localhost:8000/predict', form, {
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
    
        res.status(200).json({
            message: "success",
            img
        });
    } catch(err) {
        console.log(`error: ${err}`);
        res.status(500).json({
            error: err,
            message: "Internal Server Error"
        })
    }
    
    // select2. child-process 모듈
    // const image_pth = './input_bed.jpg';

    // const result = spawn('python', ['./return_prediction_entropy_v6.py', image_pth]);

    // result.stdout.on('data', async (data) => {
    //     let dataString = data.toString().replace(/\r\n/g, '');  // \r\n 제거
    //     let jsonData = JSON.parse(dataString);  // JSON으로 파싱

    //     console.log(`data: ${JSON.stringify(jsonData)}`);  // JSON 데이터 출력

    //     res.status(200).json({
    //         message: "success",
    //         object: jsonData.predicted_class,
    //         entropy: jsonData.entropy
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
