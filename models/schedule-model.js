const mongoose = require('mongoose');

const tiffinScheduleSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        
    },
    week_start_date: {
        type: Date,
        
    },
    weekly_schedule: [{
        day_of_week: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            
        },
        meal_type: {
            type: String,
            enum: ['breakfast', 'lunch', 'dinner'],
            
        },
        menu: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food'
        }],
        availability: {
            type: Number,
            
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TiffinSchedule', tiffinScheduleSchema);
