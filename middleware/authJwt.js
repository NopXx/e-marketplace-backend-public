const jwt = require('jsonwebtoken')
const db = require('../lib/db.js')
require('dotenv').config()

verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({
      message: 'Unknown Token'
    })
  }
  let token = req.headers.authorization.split(' ')[1]

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!'
    })
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized! Token is expire'
      })
    }
    req.user = decoded
    next()
  })
}

isAdmin = async (req, res, next) => {
  try {
    if (
      req.user.role_name === 'Admin' ||
      req.user.role_name === 'Teacher' ||
      req.user.role_name === 'admin' ||
      req.user.role_name === 'teacher'
    ) {
      return next()
    }
    return res.status(403).send({
      message: 'Require Admin Role!'
    })
  } catch (error) {
    return res.status(500).send({
      message: 'Unable to validate User role!'
    })
  }
}

isStore = (req, res, next) => {
  db.query(
    `select * from user_role where user_id = ${req.user.user_id} and role_id = 3;`,
    (err, data) => {
      if (err) {
        return res.status(401).send({
          message: err.message
        })
      } else {
          if (data.length > 0) {
            return next()
          } else {
            return res.status(404).send({
              message: 'Please Signup Store'
            })
          }
        
      }
    }
  )
}

const authJwt = {
  verifyToken,
  isAdmin,
  isStore
}
module.exports = authJwt
