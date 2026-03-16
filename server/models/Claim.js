const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['residential', 'business', 'car', 'bodily_harm'],
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'in_review', 'approved', 'rejected'],
    default: 'new'
  },
  claimantName: { type: String, required: true },
  idNumber: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  details: { type: mongoose.Schema.Types.Mixed, default: {} },
  photos: [{ type: String }]
}, {
  timestamps: true
});

// Indexes for fast filtering & querying
claimSchema.index({ type: 1, createdAt: -1 });        // Filter by type + sort by date
claimSchema.index({ status: 1, createdAt: -1 });       // Filter by status + sort by date
claimSchema.index({ type: 1, status: 1 });              // Combined type+status for stats
claimSchema.index({ idNumber: 1 }, { unique: false });  // Lookup by ID number
claimSchema.index({ createdAt: -1 });                   // Default sort

module.exports = mongoose.model('Claim', claimSchema);
