const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    name: String,
    img:String,
    rating: Number,
    comment: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' }

})