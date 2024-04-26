const mongoose = require('mongoose');

const crpcSchema = new mongoose.Schema({
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

const CRPC = mongoose.model('CRPC', crpcSchema);

module.exports = CRPC;