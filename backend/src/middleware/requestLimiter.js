const buckets = new Map();

const requestLimiter = ({ windowMs = 60 * 1000, max = 80 } = {}) => (req, res, next) => {
  const key = `${req.ip}:${req.baseUrl || req.path}`;
  const current = buckets.get(key);
  const now = Date.now();

  if (!current || current.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return next();
  }

  if (current.count >= max) {
    return res.status(429).json({ message: "Too many requests. Please try again shortly." });
  }

  current.count += 1;
  buckets.set(key, current);
  next();
};

export default requestLimiter;
