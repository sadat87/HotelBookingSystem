import mongoose from 'mongoose';

const pricingSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
      unique: true,
    },
    basePrice: {
      type: Number,
      required: true,
      min: [0, 'Base price must be non-negative'],
    },
    seasonalPricing: [{
      season: {
        type: String,
        enum: ['low', 'medium', 'high', 'peak'],
      },
      startDate: Date,
      endDate: Date,
      priceMultiplier: {
        type: Number,
        min: [0.5, 'Price multiplier cannot be less than 0.5'],
        max: [2.0, 'Price multiplier cannot exceed 2.0'],
      },
    }],
    weekendMultiplier: {
      type: Number,
      default: 1.2,
      min: [1.0, 'Weekend multiplier must be at least 1.0'],
    },
    lastUpdated: Date,
  },
  {
    timestamps: true,
  }
);

const Pricing = mongoose.model('Pricing', pricingSchema);

export default Pricing;
