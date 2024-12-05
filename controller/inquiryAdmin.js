const Inquiry = require('../models/Inquiry');
const User = require('../models/User');

const inquiryAdmin = {
    // 관리자용 사용자 문의 전체 조회
    view: async (req, res) => {
        try {
            const inquiries = await Inquiry.findAll({
                attributes: ['inquiryId', 'title', 'content', 'created_at', 'res_message', 'res_date', 'res_status', 'userId'],
                include: [
                    {
                        model: User,
                        as: 'UserInquiry',
                        attributes: ['userId']
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            if (inquiries.length === 0) {
                return res.status(200).json({
                    message: "등록된 문의사항이 없습니다.",
                    data: []
                });
            }

            res.status(200).json({
                message: "문의사항 전체 조회 성공",
                data: inquiries
            });
        } catch (error) {
            console.error('문의사항 조회 에러:', error);
            res.status(500).json({
                message: "문의사항 조회 중 오류가 발생했습니다.",
                error: error.message
            });
        }
    },
};

module.exports = inquiryAdmin;
