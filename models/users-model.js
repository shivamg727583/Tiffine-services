const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'First Name is required'],
        minlength: [2, 'First Name must be at least 2 characters long']
    },
    middle_name: {
        type: String
    },
    last_name: {
        type: String,
        required: [true, 'Last Name is required'],
        minlength: [2, 'Last Name must be at least 2 characters long']
    },
    dob: {
        type: Date,
        required: [true, 'Date of Birth is required']
    },
    phone1: {
        type: Number,
        required: [true, 'Phone Number 1 is required'],
        match: [/^\d{10}$/, 'Phone Number 1 must be 10 digits']
    },
    phone2: {
        type: Number,
        match: [/^\d{10}$/, 'Phone Number 2 must be 10 digits']
    },
    whatsapp: {
        type: Number,
        required: [true, 'WhatsApp Number is required'],
        match: [/^\d{10}$/, 'WhatsApp Number must be 10 digits']
    },
    email: {
        type: String,
        required: [true, 'Email Address is required'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    house_number: {
        type: String,
        required: [true, 'House Number is required']
    },
    street: {
        type: String,
        required: [true, 'Street is required']
    },
    area: {
        type: String,
        required: [true, 'Area is required']
    },
    colony: {
        type: String,
        required: [true, 'Colony is required']
    },
    landmark: {
        type: String
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    state: {
        type: String,
        required: [true, 'State is required']
    },
    pincode: {
        type: Number,
        required: [true, 'Pincode is required'],
        match: [/^\d{6}$/, 'Pincode must be 6 digits']
    },
    country: {
        type: String,
        required: [true, 'Country is required']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    profile_pic: {
        type: String
    },
   
    occupation: {
        type: String,
        required: [true, 'Occupation is required']
    },
    company: {
        type: String
    },
    work_city: {
        type: String
    },
    cart:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Food'
     
     }],

   
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);
