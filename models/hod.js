const mongoose = require('mongoose');

const hodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  branch: {
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

const HOD = mongoose.model('HOD', hodSchema);

module.exports = HOD;