// Validation middleware chung

const validatePagination = (req, res, next) => {
  const { page, limit, search } = req.query;

  // Validate page
  if (page !== undefined) {
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({
        success: false,
        message: 'Số trang phải là số nguyên dương'
      });
    }
    req.query.page = pageNum;
  } else {
    req.query.page = 1;
  }

  // Validate limit
  if (limit !== undefined) {
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Giới hạn phải là số từ 1 đến 100'
      });
    }
    req.query.limit = limitNum;
  } else {
    req.query.limit = 10;
  }

  // Validate search
  if (search !== undefined) {
    if (typeof search !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Từ khóa tìm kiếm phải là chuỗi ký tự'
      });
    }
    req.query.search = search.trim();
  } else {
    req.query.search = '';
  }

  next();
};

module.exports = {
  validatePagination
};