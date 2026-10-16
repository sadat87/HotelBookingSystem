// API Response formatter - standard response structure for all endpoints
export const apiResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    success: statusCode < 400,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

// Convert date strings to Date objects (useful for query filters)
export const parseDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date format');
  }
  
  return { start, end };
};

// Calculate number of nights between two dates
export const calculateNights = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Generate booking reference number
export const generateBookingReference = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substr(2, 9).toUpperCase();
  return `BK-${timestamp}-${randomStr}`;
};

// Format pagination response
export const paginateResponse = (data, page, limit, total) => {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Check if date range overlaps with another range
export const doesDateRangeOverlap = (startDate1, endDate1, startDate2, endDate2) => {
  const s1 = new Date(startDate1);
  const e1 = new Date(endDate1);
  const s2 = new Date(startDate2);
  const e2 = new Date(endDate2);
  
  return s1 < e2 && e1 > s2;
};
