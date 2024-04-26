const mongoose = require('mongoose');

const deanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    index: { unique: true}
  },
  password: {
    type: String,
    required: true
  },
  role:{
    type: String,
    required: true
  }
});

const Dean = mongoose.model('Dean', deanSchema);

module.exports = Dean;