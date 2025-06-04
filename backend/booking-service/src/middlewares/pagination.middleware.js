const DEFAULT_PAGE_SIZE = 8;
const MAX_PAGE_SIZE = 20;

const paginationMiddleware = (req, res, next) => {
  // Parse page and limit from query params
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || DEFAULT_PAGE_SIZE;

  // Validate and sanitize pagination params
  const sanitizedPage = Math.max(1, page);
  const sanitizedLimit = Math.min(Math.max(1, limit), MAX_PAGE_SIZE);

  // Calculate skip value
  const skip = (sanitizedPage - 1) * sanitizedLimit;

  // Add pagination info to request
  req.pagination = {
    page: sanitizedPage,
    limit: sanitizedLimit,
    skip
  };

  next();
};

module.exports = paginationMiddleware; 