const Sequelize = require('sequelize'); // 쿼리문 쓰지 않고 db 데이터 처리 가능한 모듈
// config/config.json에서 db 연결 정보 저장

const Classified_images = class Classified_images extends Sequelize.Model {
   static init(sequelize) {
      return super.init(
         {
            imgId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                primaryKey: true,
                autoIncrement: true
            },
            file_path: {
                type: Sequelize.STRING,
                allowNull: false
            },
            uploaded_time: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            waste_name: {
                type: Sequelize.STRING,
                allowNull: true
            },
            accuracy: {
                type: Sequelize.DECIMAL(30, 18),
                allowNull: true
            },
            userId: {
                type: Sequelize.STRING, // User 모델의 기본 키와 동일한 타입으로 설정
                allowNull: false,
                references: {
                    model: 'user',  // User 테이블을 참조
                    key: 'userId',  // User 테이블의 userId를 참조
                },
                onUpdate: 'CASCADE', // User 변경 시 Address도 변경
                onDelete: 'CASCADE', // User 삭제 시 Address도 삭제
             }
         },
         {
            sequelize,
            timestamps: false, // createdAt, udaptedAt 자동 생성
            underscored: false, // 카멜 케이스 및 스네이크 케이스 설정(false면 사용자 지정 이름 사용 가능)
            modelName: 'Classified_images', // 모델명
            tableName: 'classified_images', // 테이블명
            paranoid: false, // deletedAt 자동 생성
            charset: 'utf8', // 한글 입력 설정
            collate: 'utf8_general_ci',
         },
      );
   }

   static associate(db) {
    db.Classified_images.belongsTo(db.User, {
        foreignKey: 'userId', // classified_images 테이블의 외래 키
        targetKey: 'userId',  // User 테이블의 기본 키
        as: 'UserClassified_images',           // 관계를 참조할 때 사용할 별칭
    });

    db.Classified_images.hasMany(db.Feedback, {
        foreignKey: 'imgId', 
        sourceKey: 'imgId', 
        as: 'Feedback', 
      });
   }
};

module.exports = Classified_images;
