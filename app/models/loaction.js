const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const locationSchema = new Schema({
      user_id:{
                type:Object,
                default:''
            },
            location:{
                latitude: {
                    type: Number,
                    default:""
                    
                  },
                 longitude: {
                    type: Number,
                    default:""
                    
                  },
                },
              },    { timestamps: true });

module.exports = mongoose.model('location', locationSchema, 'location');

