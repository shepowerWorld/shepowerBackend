const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSosSchema = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        default: '',
      },

            sosId:{
                type: String,
                default: '',
            },

            commentSos: {
                type: String,
                default: '',
            },
            ratingsCount: {
                type: Number,
                default: 0, 
            },

            ratings: {
                type: Number,
                default: 0, 
            },
            reviews: {
                type: String,
                default: '',
            },
            comment_id:{
                type: String,
            }
                
              },{ timestamps: true });

module.exports = mongoose.model('commentSos', commentSosSchema, 'commentSos');

