import mongoose from 'mongoose';
import { ROOM_TYPES } from '../constants/index.js';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(ROOM_TYPES),
      required: [true, 'Room type is required'],
    },
    floor: {
      type: Number,
      required: [true, 'Floor number is required'],
      min: [0, 'Floor number must be non-negative'],
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
      max: [10, 'Capacity cannot exceed 10'],
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price must be non-negative'],
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    amenities: [{
      type: String,
      enum: [
        'wifi',
        'air_conditioning',
        'tv',
        'refrigerator',
        'microwave',
        'coffee_maker',
        'workout_facility',
        'pool',
        'balcony',
        'safe',
        'hairdryer',
        'phone',
      ],
    }],
    images: [{
      url: String,
      caption: String,
    }],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    maintenanceScheduled: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
roomSchema.index({ roomNumber: 1 });
roomSchema.index({ type: 1 });
roomSchema.index({ floor: 1 });
roomSchema.index({ isAvailable: 1 });

const Room = mongoose.model('Room', roomSchema);

export default Room;
