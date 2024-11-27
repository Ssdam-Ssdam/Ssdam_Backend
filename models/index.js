const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

// 모델 정의 모듈 불러오기
const User = require('./User');
const Address = require('./Address');
const Inquiry = require('./Inquiry');

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// DB객체에 모델 정보 넣기
db.sequelize = sequelize;
db.User = User;
db.Address = Address;
db.Inquiry = Inquiry;

// 모델-테이블 연결
User.init(sequelize);
Address.init(sequelize);
Inquiry.init(sequelize);

// 모델 관계 설정
User.associate(db);
Address.associate(db);
Inquiry.associate(db);

module.exports = db;
