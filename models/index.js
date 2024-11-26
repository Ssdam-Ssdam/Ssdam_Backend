const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

// 모델 정의 모듈 불러오기
const User = require('./User');

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// DB객체에 모델 정보 넣기
db.sequelize = sequelize;
db.User = User;

// 모델-테이블 연결
User.init(sequelize);

// 모델 관계 설정
User.associate(db);

module.exports = db;
