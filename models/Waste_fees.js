const Sequelize = require('sequelize'); // 쿼리문 쓰지 않고 db 데이터 처리 가능한 모듈
// config/config.json에서 db 연결 정보 저장

const Waste_fees = class Waste_fees extends Sequelize.Model {
   static init(sequelize) {
      return super.init(
         {
            feesId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                primaryKey: true,
                autoIncrement: true
            },
            region: {
                type: Sequelize.STRING,
                allowNull: false
            },
            sub_region: {
                type: Sequelize.STRING,
                allowNull: false
            },
            waste_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            waste_standard: {
                type: Sequelize.STRING,
                allowNull: true
            },
            waste_category: {
                type: Sequelize.STRING,
                allowNull: true
            },
            fee: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
         },
         {
            sequelize,
            timestamps: false, // createdAt, udaptedAt 자동 생성
            underscored: false, // 카멜 케이스 및 스네이크 케이스 설정(false면 사용자 지정 이름 사용 가능)
            modelName: 'Waste_fees', // 모델명
            tableName: 'waste_fees', // 테이블명
            paranoid: false, // deletedAt 자동 생성
            charset: 'utf8', // 한글 입력 설정
            collate: 'utf8_general_ci',
         },
      );
   }

   static associate(db) {

   }
};

module.exports = Waste_fees;
