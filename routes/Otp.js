const express = require('express')
const router = express.Router()
const authJwt = require('../middleware/authJwt')
const db = require('../lib/db.js')
const verify = require('../middleware/verifyForm')

const gen_otp = () => {
  var digits = '1234567890'
  var otp = ''
  for (i = 0; i < 4; i++) {
    otp += digits[Math.floor(Math.random() * 10)]
  }
  return otp
}

router.get('/getOtp', [authJwt.verifyToken], (req, res) => {
  return res.status(200).send({
    otp: gen_otp()
  })
})

router.post('/req-otp', [authJwt.verifyToken, verify.ReqOTP], (req, res) => {
  const user_id = req.user.user_id
  const tel = req.body.tel
  const user_a_id = req.body.user_address_id
  const otp = gen_otp()
  db.query(
    `select user_id from user_address where user_id = ${user_id} AND user_a_id = ${user_a_id};`,
    (err, result) => {
      if (err) {
        return res.status(400).send({
          code: err.code,
          message: err.message
        })
      } else {
        if (result.length === 0) {
          return res.status(404).send({
            message: 'user_address_id not found'
          })
        } else {
          db.query(
            `insert into otp (user_id, user_a_id, otp_number, tel) 
                VALUES (${user_id}, ${user_a_id}, ${otp}, ${tel});`,
            (err, result) => {
              if (err) {
                return res.status(400).send({
                  code: err.code,
                  message: err.message
                })
              } else {
                return res.status(200).send({
                  message: 'Request OTP Success',
                  otp: otp
                })
              }
            }
          )
        }
      }
    }
  )
})

router.post('/ver-otp', [authJwt.verifyToken, verify.verifyOTP], (req, res) => {
  const user_id = req.user.user_id
  const otp = req.body.otp
  const user_a_id = req.body.user_address_id
  db.query(
    `select * from otp where user_id = ${user_id} AND user_a_id = ${user_a_id} AND otp_number = ${otp};`,
    (err, result) => {
      if (err) {
        return res.status(400).send({
          code: err.code,
          message: err.message
        })
      } else {
        if (result.length === 0) {
          return res.status(400).send({
            message: 'otp not match'
          })
        } else {
          db.query(
            `UPDATE user_address SET status = 1 WHERE user_id = ${user_id} AND user_a_id = ${user_a_id}`,
            (err, result1) => {
              if (err) {
                return res.status(400).send({
                  code: err.code,
                  message: err.message
                })
              } else {
                db.query(
                  `delete from otp where user_id = ${user_id} 
                    AND user_a_id = ${user_a_id} AND otp_number = ${otp} ;`,
                  (err, result2) => {
                    if (err) {
                      return res.status(400).send({
                        code: err.code,
                        message: err.message
                      })
                    } else {
                      return res.status(200).send({
                        message: 'verify otp success'
                      })
                    }
                  }
                )
              }
            }
          )
        }
      }
    }
  )
})

module.exports = router
