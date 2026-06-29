const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')

// Simulação em memória — substitua por chamadas ao banco real
const users = []

exports.register = async ({ name, email, password }) => {
  if (users.find((u) => u.email === email)) {
    throw Object.assign(new Error('E-mail já cadastrado'), { status: 409 })
  }
  const hashed = await bcrypt.hash(password, 10)
  const user = { id: Date.now().toString(), name, email, password: hashed }
  users.push(user)
  const { password: _, ...safe } = user
  return safe
}

exports.login = async ({ email, password }) => {
  const user = users.find((u) => u.email === email)
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw Object.assign(new Error('Credenciais inválidas'), { status: 401 })
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
  const { password: _, ...safe } = user
  return { user: safe, token }
}

exports.findById = async (id) => {
  const user = users.find((u) => u.id === id)
  if (!user) throw Object.assign(new Error('Usuário não encontrado'), { status: 404 })
  const { password: _, ...safe } = user
  return safe
}
