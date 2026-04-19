const mongoose = require('mongoose');

const threatDetailSchema = new mongoose.Schema({
  factor: { type: String, required: true },
  description: { type: String, required: true },
  points: { type: Number, required: true }
}, { _id: false });

const scanResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true
  },
  normalizedUrl: {
    type: String,
    trim: true
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  riskLevel: {
    type: String,
    required: true,
    enum: ['safe', 'suspicious', 'dangerous']
  },
  threats: [threatDetailSchema],
  details: {
    protocol: String,
    hostname: String,
    path: String,
    hasSSL: Boolean,
    domainAge: String,
    ipBased: Boolean,
    redirectCount: Number
  },
  isFlagged: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient querying
scanResultSchema.index({ userId: 1, createdAt: -1 });
scanResultSchema.index({ riskLevel: 1 });

module.exports = mongoose.model('ScanResult', scanResultSchema);
