import mongoose from 'mongoose';
import { BOOKING_STATUS, PAYMENT_STATUS, PAYMENT_METHODS } from '../constants/index.js';

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Guest ID is required'],
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room ID is required'],
    },
    checkInDate: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Check-out date is required'],
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'At least 1 guest is required'],
    },
    numberOfNights: {
      type: Number,
      required: true,
    },
    roomPrice: {
      type: Number,
      required: true,
      min: [0, 'Price must be non-negative'],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price must be non-negative'],
    },
    specialRequests: {
      type: String,
      maxlength: [500, 'Special requests cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
      index: true,
    },
    payment: {
      status: {
        type: String,
        enum: Object.values(PAYMENT_STATUS),
        default: PAYMENT_STATUS.PENDING,
      },
      method: {
        type: String,
        enum: Object.values(PAYMENT_METHODS),
      },
      transactionId: String,
      paidAmount: Number,
      paidAt: Date,
    },
    cancellationReason: String,
    cancelledAt: Date,
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
bookingSchema.index({ guest: 1 });
bookingSchema.index({ room: 1 });
bookingSchema.index({ checkInDate: 1, checkOutDate: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'payment.status': 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
