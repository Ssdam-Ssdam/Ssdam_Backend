const jwt = require('jsonwebtoken');
const axios = require('axios');
const fs = require('fs');
const csvParser = require('csv-parser');
const haversine = require('haversine');

// 토큰 유효성 검사
async function authenticateAccessToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) { // 토큰이 없을 때
        console.log(`req.header: ${req.headers['authorization']}`);
        return res.status(401).json({
            "message": "there is no Token"
        });
    }

    jwt.verify(token, process.env.ACCESS_KEY, (err, user) => {
        if (err){
            console.log(`verify error: ${err}`);
            if (err.name === 'TokenExpiredError') {
                // 토큰의 유효기간이 만료된 경우
                return res.status(401).json({
                    "message": "Token has expired."
                })
            } else {
                // 다른 인증 오류인 경우
                return res.status(403).json({
                    "message": "verify Error"
                });
            }
        }
        req.userId = user.userId; // req 에 임시 저장
        req.is_admin = user.is_admin;
        next();
    });
}

// 관리자용 계정 검증
async function authenticateAdmin(req, res, next) {
    if(!req.is_admin){ // 사용자용 계정일 때
        return res.status(403).json({
            "message": "Permission denied" // 권한 없음
        })
    } else {
        next();
    }
}

async function getCoordinates(address) {
    if (!address) {
        throw new Error('Address is required');
    }   


  try {
    // VWorld API 호출
    const response = await axios.get('https://api.vworld.kr/req/address', {
      params: {
        service: 'address',
        request: 'GetCoord',
        version: '2.0',
        crs: 'EPSG:4326',
        type: 'ROAD',
        address: address,
        format: 'json',
        errorformat: 'json',
        key: process.env.GEOCODER_KEY
      }
    });

    const result = response.data;

    // 결과 출력 (디버깅용)
    console.log(JSON.stringify(result, null, 2));

    // 결과가 유효한지 확인
    if (result.response && result.response.result) {
        const { x, y } = result.response.result.point;
        return { latitude: y, longitude: x };
    //   const { x, y } = result.response.result.point;
    //   return { x: x, y: y };
    } else {
      throw new Error('Address not found');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Something went wrong');
  }
}

// 가까운 거리 순 50개의 데이터 추출
async function getClosestLocations(user_address, csvFilePath) {
    console.log(`user_addres: ${user_address}`);
    console.log(`csvFilePath: ${csvFilePath}`);

    try {
      // 1. Get user address coordinates
      const userCoordinates = await getCoordinates(user_address);
      console.log(`user_coordinates: ${userCoordinates.latitude}, ${userCoordinates.longitude}`);
  
      if (!userCoordinates) {
        throw new Error('Unable to fetch coordinates for user address.');
      }
  
      // 2. Read CSV file and parse rows
      const csvData = [];
      await new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
          .pipe(csvParser())
          .on('data', (row) => {
            if (row.latitude && row.longitude) {
              csvData.push({
                ...row,
                latitude: parseFloat(row.latitude),
                longitude: parseFloat(row.longitude),
              });
            }
          })
          .on('end', resolve)
          .on('error', reject);
      });
  
      // 3. Calculate distances
      const distances = csvData.map((row) => {
        const distance = haversine(
          { latitude: userCoordinates.latitude, longitude: userCoordinates.longitude },
          { latitude: row.latitude, longitude: row.longitude }
        );
        return { ...row, distance };
      });
  
      // 4. Sort by distance and get closest 50
      const closestLocations = distances
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 50);
  
      return closestLocations;
    } catch (error) {
      console.error('Error fetching closest locations:', error);
      throw error;
    }
  }

module.exports = {
    authenticateAccessToken,
    authenticateAdmin,
    getCoordinates,
    getClosestLocations
}
