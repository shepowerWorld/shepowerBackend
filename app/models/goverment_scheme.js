const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const govScheme = new Schema ({ 

    States_or_union_territories : { 
        type: String,
        required: true
    },

    policy_page_link : {
        type: String, 
        required: true
    },


    locationType: {
        type: String,
        required: true,
        enum: ['state', 'territory'], // Only 'state' or 'territory' can be assigned
    }

}
,
{ timestamps: true }
)


module.exports = mongoose.model('govScheme', govScheme, 'govScheme');