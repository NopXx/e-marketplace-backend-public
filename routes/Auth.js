const express = require('express')
require('dotenv').config()
const router = express.Router()
const jwt = require('jsonwebtoken')
const db = require('../lib/db.js')
const authJwt = require('../middleware/authJwt')
const userMiddleware = require('../middleware/user')

router.post('/sign-up', userMiddleware.validateRegister, (req, res, next) => {
  db.query(
    `SELECT * FROM user WHERE tel = LOWER(${db.escape(req.body.tel)});`,
    (err, result) => {
      if (result.length) {
        return res.status(403).send({
          message: 'Telephone Number is Activation'
        })
      } else {
        // username is available
        // has hashed pw => add to database
        // console.log(req.body.username)
        db.query(
          `INSERT INTO user (f_name, l_name, username, password, tel, created_at) VALUES ('${req.body.f_name}', '${req.body.l_name}', '${req.body.username}', '${req.body.password}', '${req.body.tel}', now())`,
          (err, result) => {
            if (err) {
              return res.status(400).send({
                code: err.code,
                message: err.message
              })
            } else {
              db.query(
                `INSERT INTO user_role (user_id, role_id) VALUES (${result.insertId}, 1);`,
                (err, result1) => {
                  if (err) {
                    return res.status(400).send({
                      code: err.code,
                      message: err.message
                    })
                  } else {
                    return res.status(201).send({
                      message: 'Registered!'
                    })
                  }
                }
              )
            }
          }
        )
      }
    }
  )
})

router.post('/login', userMiddleware.validateRegister, (req, res, next) => {
  db.query(
    `SELECT user.f_name, user.user_id, role.role_id, role.role_name FROM user 
      LEFT JOIN user_role ON user_role.user_id = user.user_id 
      LEFT JOIN role ON user_role.role_id = role.role_id  
      WHERE username = '${req.body.username}' AND password = '${req.body.password}';`,
    (err, result) => {
      // user does not exists
      if (err) {
        return res.status(400).send({
          code: err.code,
          message: err.message
        })
      } else {
        if (result.length === 0) {
          return res.status(404).send({
            msg: 'username or password not found'
          })
        } else {
          const userData = {
            f_name: result[0].f_name,
            role_id: result[0].role_id,
            role_name: result[0].role_name,
            user_id: result[0].user_id
          }
          const secret = process.env.ACCESS_TOKEN_SECRET
          const options = {
            expiresIn: '2h'
          }
          jwt.sign(userData, secret, options, (err, token) => {
            if (err) {
              console.log(err)
            } else {
              db.query(
                `UPDATE user SET last_login = now() WHERE user_id = '${result[0].user_id}'`
              )
              return res.status(200).send({
                message: 'Logged in!',
                token,
                user: result[0]
              })
            }
          })
        }
      }
    }
  )
})
router.get('/getuser', authJwt.verifyToken, (req, res, next) => {
  //   console.log(req.user);
  res.send(req.user)
})

module.exports = router
