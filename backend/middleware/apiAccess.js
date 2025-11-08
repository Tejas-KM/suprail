// Simple API key + optional IP allowlist middleware for secure downloads
export function requireApiAccess(req, res, next) {
  const configuredKey = process.env.REPORT_API_KEY || process.env.API_KEY;
  if (!configuredKey) {
    return res.status(500).json({ error: 'Server is not configured with REPORT_API_KEY' });
  }

  // Accept key via header or query param
  const providedKey = req.headers['x-api-key'] || req.query.key || req.query.api_key;
  if (!providedKey || String(providedKey) !== String(configuredKey)) {
    return res.status(401).json({ error: 'Unauthorized: invalid API key' });
  }

  // Optional IP allow list: comma-separated values in REPORT_ALLOWED_IPS
  const list = (process.env.REPORT_ALLOWED_IPS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (list.length > 0) {
    // Determine client IP: prefer first x-forwarded-for element, then req.ip
    const xff = req.headers['x-forwarded-for'];
    const ip = xff ? String(xff).split(',')[0].trim() : (req.ip || '');
    // Support wildcard '*' and exact match
    const allowed = list.includes('*') || list.includes(ip);
    if (!allowed) {
      return res.status(403).json({ error: 'Forbidden: IP not allowed', ip });
    }
  }

  return next();
}
