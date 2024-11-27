const Inquiry = require('../models/Inquiry');

const inquiry_create = async (req, res) => {
    const userId = req.userId;
    const { title, content } = req.body;

    try {
        const inquiry = await Inquiry.create({
            title: title,
            content: content,
            userId: userId
        })

        if(!inquiry){
            res.status(500).json({
                message: "failed to insert inquiry"
            })
        } else {
            res.status(200).json({
                message: "inquiry registered successfully",
                inquiryId: inquiry.inquiryId,
                title: inquiry.title,
                content: inquiry.content,
                created_at: inquiry.created_at,
                res_status: inquiry.res_status
            })
        }
    } catch(err) {
        console.log(`error: ${err}`);
        res.status(500).json({
            "error": err,
            message: "Internal Server Error"
        })
    }
}

const inquiry_viewAll = async (req, res) => {
    const userId = req.userId;

    try {
        const inquiry = await Inquiry.findAll({
            where: {
                userId: userId
            }
        })

        if(inquiry.length === 0) {
            res.status(200).json({
                message: "no inquiries registered"
            })
        } else {
            res.status(200).json({
                message: "no inquiries registered",
                inquiry: inquiry
            })
        }
    } catch(err) {
        console.log(`error: ${err}`);
        res.status(500).json({
            error: err,
            message: "Internal Server Error"
        })
    }
}

const inquiry_view = async (req, res) => {
    const { inquiryId } = req.query;

    try {
        const inquiry = await Inquiry.findOne({
            where: {
                inquiryId: inquiryId
            }
        })

        if(!inquiry) {
            res.status(404).json({
                message: "no inquiry regisetered"
            })
        } else {
            res.status(200).json({
                message: "inquiry call successful",
                inquiryId: inquiry.inquiryId,
                title: inquiry.title,
                content: inquiry.content,
                created_at: inquiry.created_at,
                res_message: inquiry.res_message,
                res_date: inquiry.res_date,
                res_status: inquiry.res_status
            })
        }
    } catch(err) {
        console.log(`error: ${err}`);
        res.status(500).json({
            error: err,
            message: "Internal Server Error"
        })
    }
}

const inquiry_delete = async (req, res) => {
    const { inquiryId } = req.body;

    try {
        const inquiry = await Inquiry.destroy({
            where: {
                inquiryId: inquiryId
            }
        })

        if(!inquiry){
            res.status(404).json({
                message: "no inquiry regisetered"
            })
        } else {
            res.status(200).json({
                message: "inquiry deleted successfully"
            })
        }
    } catch(err) {
        console.log(`error: ${err}`);
        res.status(500).json({
            error: err,
            message: "Internal Server Error"
        })
    }
}

module.exports = {
    inquiry_create,
    inquiry_viewAll,
    inquiry_view,
    inquiry_delete
}
