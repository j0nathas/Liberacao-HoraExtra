const userService = require('../services/user.service')

exports.register = async (req, res, next) => {
  try {
    const user = await userService.register(req.body)
    res.status(201).json(user)
  } catch (err) { next(err) }
}

exports.login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body)
    res.json(result)
  } catch (err) { next(err) }
}

exports.me = async (req, res, next) => {
  try {
    const user = await userService.findById(req.userId)
    res.json(user)
  } catch (err) { next(err) }
}
