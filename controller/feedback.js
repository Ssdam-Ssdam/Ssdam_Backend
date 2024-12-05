const Feedback = require('../models/Feedback');
const User = require('../models/User');
const Classified_images = require('../models/Classified_images');

const feedback = {
    // 피드백 전체 조회
    view: async (req, res) => {
        try {
            const feedbacks = await Feedback.findAll({
                attributes: ['feedbackId', 'is_good', 'waste_name', 'userId', 'imgId'],
                include: [
                    {
                        model: User,
                        as: 'UserFeedback',
                        attributes: ['userId'],
                    },
                    {
                        model: Classified_images,
                        as: 'imgFeedback',
                        attributes: ['file_path', 'waste_name', 'accuracy'],
                    },
                ],
                order: [['feedbackId', 'DESC']],
            });

            if (feedbacks.length === 0) {
                return res.status(200).json({ message: '조회된 피드백이 없습니다.', data: [] });
            }

            return res.status(200).json({ message: '피드백 조회 성공', data: feedbacks });
        } catch (error) {
            console.error('피드백 조회 에러:', error);
            return res.status(500).json({ message: '피드백 조회 중 오류가 발생했습니다.', error: error.message });
        }
    },
};

module.exports = feedback;
