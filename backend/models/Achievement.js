const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['certification', 'award', 'project', 'education', 'experience', 'other'],
    default: 'certification'
  },
  documentUrl: {
    type: String,
    default: ''
  },
  documentName: {
    type: String,
    default: ''
  },
  issueDate: {
    type: Date,
    default: null
  },
  issuer: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ''
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

achievementSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Achievement', achievementSchema);
