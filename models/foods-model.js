const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    food_name: {
        type: String,
        required: true,
        trim: true
    },
    food_description: {
        type: String,
        required: true
    },
    cuisine_type: {
        type: String,
        required: true,
        enum: ['Indian', 'Chinese', 'Continental', 'Italian', 'Other'] // Add more as per your app's needs
    },
    category: {
        type: String,
        enum: ['Vegetarian', 'Non-Vegetarian'], // Add this field
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    food_image: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor', 
    },
    mealType:{
        type:String,
        enum: ['Breakfast', 'Lunch', 'Dinner'],
        required:true
    }

    
},{timestamps:true});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
