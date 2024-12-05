const Feedback = require('../models/Feedback');
const Waste_fees = require('../models/Waste_fees');
const Classified_images = require('../models/Classified_images');

const feedback = async (req, res) => {
    const userId = req.userId;
    const { imgId, is_good, waste_name } = req.body;

    try {
        const feedback = await Feedback.create({
            imgId: imgId,
            is_good: is_good,
            waste_name: waste_name,
            userId: userId
        });

        if(!feedback){
            res.status(500).json({
                message: "failed to insert feedback"
            })
        } else {
            res.status(200).json({
                message: "feedback saved successfully"
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

const search = async (req, res) => {
    const { waste_name } = req.query;

    try {
        const wastes = await Waste_fees.findAll({
            where: {
                waste_name: waste_name
            }
        })

        console.log(`waste search length: ${wastes.length}`);
        res.status(200).json({
            message: "waste fee search successfully",
            wastes
        })
    } catch(err) {
        console.log(`error: ${err}`);
        res.status(500).json({
            error: err,
            message: "Internal Server Error"
        })
    }
}

const nearbyStores = async (req, res) => {

}

const upload_img = async (req, res) => {
    var file = '/img/' + req.file.filename;

    
}

module.exports = {
    feedback,
    search,
    nearbyStores,
    upload_img
}
