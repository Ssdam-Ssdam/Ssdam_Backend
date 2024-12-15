const Classified_images = require('../models/Classified_images');
const User = require('../models/User');

const classifiedImg = {
    // 이미지 목록 조회
    view: async (req, res) => {
        try {
            const images = await Classified_images.findAll({
                include: [
                    {
                        model: User,
                        as: 'UserClassified_images',
                        attributes: ['userId'], // User 테이블에서 필요한 필드만 가져옴
                    }
                ],
                order: [['uploaded_time', 'DESC']], // 업로드 시간 기준 내림차순 정렬
            });

            if (images.length === 0) {
                return res.status(200).json({ message: '조회된 이미지가 없습니다.', images: [] });
            }

            return res.status(200).json({ message: '이미지 조회 성공', images: images });
        } catch (error) {
            console.error('이미지 조회 에러:', error);
            return res.status(500).json({ message: '이미지 조회 중 오류가 발생했습니다.', error: error.message });
        }
    },

    // 이미지 삭제
    delete: async (req, res) => {
        const { imgId } = req.body; // 삭제할 이미지 ID

        if (!imgId) {
            return res.status(400).json({ message: '이미지 ID를 입력해주세요.' });
        }

        try {
            // 해당 imgId의 이미지 데이터 조회
            const image = await Classified_images.findOne({ where: { imgId } });

            if (!image) {
                return res.status(404).json({ message: '삭제할 이미지를 찾을 수 없습니다.' });
            }

            // 이미지 데이터 삭제
            await Classified_images.destroy({ where: { imgId } });

            return res.status(200).json({ message: `이미지 ID ${imgId}가 성공적으로 삭제되었습니다.` });
        } catch (error) {
            console.error('이미지 삭제 에러:', error);
            return res.status(500).json({ message: '이미지 삭제 중 오류가 발생했습니다.', error: error.message });
        }
    }
};

module.exports = classifiedImg;