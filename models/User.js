const Sequelize = require('sequelize'); // 쿼리문 쓰지 않고 db 데이터 처리 가능한 모듈
// config/config.json에서 db 연결 정보 저장

const User = class User extends Sequelize.Model {
   static init(sequelize) {
      return super.init( //user 필드 정의
         {
            // 시퀄라이즈는 id 자동 생성 (auto_increament) -> PK
            // 하지만 userId와 같이 명시적 필드 PK 정의 위해 primarykey 속성 사용
            userId: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                primaryKey: true
            },
            password: {
                type: Sequelize.STRING ,
                allowNull: false
            },
            userName: {
                type: Sequelize. STRING,
                allowNull: false
            },
            userEmail: {
                type: Sequelize.STRING,
                allowNull: false
            },
            is_admin: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
         },
         {
            sequelize,
            timestamps: false, // createdAt, udaptedAt 자동 생성
            underscored: false, // 카멜 케이스 및 스네이크 케이스 설정(false면 사용자 지정 이름 사용 가능)
            modelName: 'User', // 모델명
            tableName: 'user', // 테이블명
            paranoid: false, // deletedAt 자동 생성
            charset: 'utf8', // 한글 입력 설정
            collate: 'utf8_general_ci',
         },
      );
   }

   static associate(db) {
      /*
       * 따로 외래키를 지정하지않으면, 모델명+기본키 컬럼이 생성되서 자동으로 연결된다.
       * 즉, User와 id가 합쳐져서 Userid라는 필드가 생겨서 자동연결해준다.
       * db.User.hasMany(db.Post, { foreignKey: 'Userid', targetKey: 'id' })
       */
    //   db.User.hasMany(db.Post); -> 예시
   }
};

module.exports = User;
