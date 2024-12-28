const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    business_name: { type: String, required: true },
    owner_name: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: function(v) {
                return /\S+@\S+\.\S+/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { 
        type: Number, 
        required: true,
        validate: {
            validator: function(v) {
                return /^[1-9][0-9]{5}$/.test(v);
            },
            message: props => `${props.value} is not a valid pincode!`
        }
    },
    cuisine: String,
    gst_number: String,
    business_license: String,
    password: { 
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                return v.length >= 6;
            },
            message: props => `Password must be at least 6 characters long!`
        }
    },
    experience: String,

    foodItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food'
    }],
    reviews:{
        type: Array,
        default:[]

    },
    profilePicture:{
        type: String,
        default: ''

    }



});

vendorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Vendor', vendorSchema);
