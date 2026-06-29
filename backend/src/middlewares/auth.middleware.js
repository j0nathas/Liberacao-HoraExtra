const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido' })
  }
  try {
    const { userId } = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET)
    req.userId = userId
    next()
  } catch {
    res.status(401).json({ message: 'Token inválido ou expirado' })
  }
}
