// Very basic mock auth: reads x-user-id and x-user-role headers
export function mockAuth(req, res, next) {
  const userId = req.header('x-user-id');
  const role = req.header('x-user-role');
  if (!userId || !role) return res.status(401).json({ error: 'Missing auth headers' });
  req.user = { id: Number(userId), role };
  next();
}

export function requireRole(roles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}
