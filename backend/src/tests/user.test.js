const request = require('supertest')
const app     = require('../app')

describe('POST /api/users/register', () => {
  it('deve criar um usuário e retornar 201', async () => {
    const res = await request(app).post('/api/users/register').send({
      name: 'Teste',
      email: 'teste@exemplo.com',
      password: 'senha123',
    })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body).not.toHaveProperty('password')
  })
})

describe('POST /api/users/login', () => {
  it('deve retornar token ao fazer login', async () => {
    await request(app).post('/api/users/register').send({
      name: 'Login',
      email: 'login@exemplo.com',
      password: 'senha123',
    })
    const res = await request(app).post('/api/users/login').send({
      email: 'login@exemplo.com',
      password: 'senha123',
    })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
  })
})
