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
                    inquiries: []
                });
            }

            res.status(200).json({
                message: "문의사항 전체 조회 성공",
                inquiries: inquiries
            });
        } catch (error) {
            console.error('문의사항 조회 에러:', error);
            res.status(500).json({
                message: "문의사항 조회 중 오류가 발생했습니다.",
                error: error.message
            });
        }
    },

    // 관리자용 문의사항 답변 생성
    createAnswer: async (req, res) => {
        const { inquiryId, res_message } = req.body;

        try {
            // 해당 문의사항이 존재하는지 확인
            const inquiry = await Inquiry.findOne({
            where: { inquiryId },
                include: [
                    {
                        model: User,
                        as: 'UserInquiry',  // 작성자 정보
                        attributes: ['userName']
                    }
                ]
            });

            if (!inquiry) {
                return res.status(404).json({
                    message: "해당 문의사항을 찾을 수 없습니다."
                });
            }

            if (inquiry.res_status === true) {
                return res.status(400).json({
                    message: "이미 답변이 등록된 문의사항입니다."
                });
            }

            // 답변 생성
            inquiry.res_message = res_message;
            inquiry.res_date = new Date(); 
            inquiry.res_status = true; 

            await inquiry.save();

            res.status(200).json({
                message: "문의사항 답변이 성공적으로 등록되었습니다.",
                inquiry: {
                    inquiryId: inquiry.inquiryId,
                    title: inquiry.title,
                    content: inquiry.content,
                    userName: inquiry.UserInquiry ? inquiry.UserInquiry.userName : '알 수 없음', // 작성자 이름
                    created_at: inquiry.created_at,
                    res_message: inquiry.res_message,
                    res_date: inquiry.res_date,
                    res_status: inquiry.res_status
                }
            });
        } catch (error) {
            console.error('문의사항 답변 생성 에러:', error);
            res.status(500).json({
                message: "문의사항 답변 생성 중 오류가 발생했습니다.",
                error: error.message
            });
        }
    },

    // 관리자용 문의사항 답변 수정
    updateAnswer: async (req, res) => {
        const { inquiryId, res_message } = req.body;

        try {
            const inquiry = await Inquiry.findOne({
                where: { inquiryId }
            });

            if (!inquiry) {
                return res.status(404).json({
                    message: "해당 문의사항을 찾을 수 없습니다."
                });
            }

            // 답변 상태 확인
            if (inquiry.res_status !== true) {
                return res.status(400).json({
                    message: "아직 답변이 작성되지 않은 문의사항입니다. 먼저 답변을 작성하세요."
                });
            }

            // 답변 수정
            inquiry.res_message = res_message;
            inquiry.res_date = new Date();

            await inquiry.save();

            res.status(200).json({
                message: "문의사항 답변이 성공적으로 수정되었습니다.",
                inquiry: {
                    inquiryId: inquiry.inquiryId,
                    title: inquiry.title,
                    content: inquiry.content,
                    userName: inquiry.UserInquiry ? inquiry.UserInquiry.userName : '알 수 없음', // 작성자 이름
                    created_at: inquiry.created_at,
                    res_message: inquiry.res_message,
                    res_date: inquiry.res_date,
                    res_status: inquiry.res_status
                }
            });
        } catch (error) {
            console.error('문의사항 답변 수정 에러:', error);
            res.status(500).json({
                message: "문의사항 답변 수정 중 오류가 발생했습니다.",
                error: error.message
            });
        }
    },

    // 관리자용 문의사항 삭제
    delete: async (req, res) => {
        const { inquiryId } = req.body;

        if (!inquiryId) {
            return res.status(400).json({ 
                message: "inquiryId는 필수 입력 값입니다." 
            });
        }

        try {
            // 해당 문의사항이 존재하는지 확인
            const inquiry = await Inquiry.findOne({
                where: { inquiryId },
                include: [
                    {
                        model: User,
                        as: 'UserInquiry',  // 작성자 정보
                        attributes: ['userName']
                    }
                ]
            });
            if (!inquiry) {
                return res.status(404).json({
                    message: "해당 문의사항을 찾을 수 없습니다."
                });
            }
            // 문의사항 삭제
            await inquiry.destroy();

            res.status(200).json({
                message: "문의사항이 성공적으로 삭제되었습니다.",
                inquiry: {
                    inquiryId: inquiry.inquiryId,
                    title: inquiry.title,
                    userName: inquiry.UserInquiry ? inquiry.UserInquiry.userName : '알 수 없음', // 작성자 이름
                    created_at: inquiry.created_at // 생성일
                }
            });
        } catch (error) {
            console.error('문의사항 삭제 에러:', error);
            res.status(500).json({
                message: "문의사항 삭제 중 오류가 발생했습니다.",
                error: error.message
            });
        }
    }
};

module.exports = inquiryAdmin;
