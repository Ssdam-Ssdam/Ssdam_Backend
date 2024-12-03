const User = require('../models/User');
const Address = require('../models/Address');
const { sequelize } = require('../models');

// 전체 사용자 조회
const view = async (req, res) => {
    try {
        const users = await User.findAll(); // 모든 사용자 정보 조회
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '회원 정보 조회 중 오류 발생.' });
    }
};

// 사용자 생성
const create = async (req, res) => {
    const { userId, password, name, email, region, sub_region, street, detail_address, zonecode    } = req.body;

    const t = await sequelize.transaction(); // 트랜잭션 시작

    // 필수 입력 값 검증
    if (!userId || !password || !name || !email || !region || !sub_region || !zonecode) {    // 필수 입력값은 region,sub_region,zonecode 까지만
        return res.status(400).json({ message: '필수 입력 값이 누락되었습니다.' });
    }

    try {
        const existingUser = await User.findOne({ where: { userId } });
        if (existingUser) {
            return res.status(400).json({ message: '이미 존재하는 userId입니다.' });
        }

        // 사용자 생성
        const newUser = await User.create(
            {
                userId,
                password,
                userName: name,
                userEmail: email
            },
            { transaction: t } // 트랜잭션 사용
        );

        // 주소 정보 추가
        const newAddress = await Address.create({
            userId: newUser.userId, // 새로 생성된 사용자의 userId를 주소에 연결
            region,
            sub_region,
            street,
            detail_address,
            zonecode
        },
        { transaction: t } // 트랜잭션 사용
    );

    await t.commit(); // 성공 시 트랜잭션 커밋
        res.status(201).json({ message: '회원 및 주소 생성 완료!', user: newUser, address: newAddress });
    } catch (err) {
        await t.rollback(); // 오류 발생 시 롤백
        console.error(err);
        res.status(500).json({ message: '회원 생성 중 오류 발생.' });
    }
};

const update = async (req, res) => {
    const { userId, password, name, email, region, sub_region, street, detail_address, zonecode } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'userId는 필수 입력 값입니다.' });
    }

    const t = await sequelize.transaction();

    try {
        // 사용자 조회
        const user = await User.findOne({ where: { userId } });
        if (!user) {
            return res.status(404).json({ message: '존재하지 않는 회원입니다.' });
        }

        // 사용자 정보 수정
        await user.update({
            password,
            userName: name,
            userEmail: email
        }, { transaction: t });

        // 주소 정보 수정
        const address = await Address.findOne({ where: { userId } });
        if (address) {
            await address.update({
                region,
                sub_region,
                street,
                detail_address,
                zonecode
            }, { transaction: t });
        } else {
            // 주소가 없으면 새로 생성
            await Address.create({
                userId,
                detail_address,
                zonecode
            }, { transaction: t });
        }

        await t.commit();
        res.status(200).json({ message: '회원 및 주소 수정 완료!', user });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: '회원 수정 중 오류 발생.' });
    }
};

// 사용자 삭제
const deleteUser = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'userId는 필수 입력 값입니다.' });
    }

    try {
        const user = await User.findOne({ where: { userId } });
        if (!user) {
            return res.status(404).json({ message: '존재하지 않는 회원입니다.' });
        }

        await user.destroy();
        res.status(200).json({ message: '회원 삭제 완료!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '회원 삭제 중 오류 발생.' });
    }
};

module.exports = {
    view,
    create,
    update,
    deleteUser
};
