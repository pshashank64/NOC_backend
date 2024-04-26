const mongoose = require('mongoose');

const nocSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    index: {unique: true}
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    index: { unique: true}
  },
  roll: {
    type: String,
    required: true,
    index: { unique: true}
  },
  ctc: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  joiningDate: {
    type: String
  },
  isApproved: {
    type: Boolean
  },
  hodApproval:{
    type: Boolean
  },
  crpcApproval: {
    type: Boolean
  },
  deanApproval: {
    type: Boolean
  },
  isRejected: {
    type: Boolean
  },
  rejectedBy: {
    type: String
  }
});

const Noc = mongoose.model('Noc', nocSchema);

module.exports = Noc;