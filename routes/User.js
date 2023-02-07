const express = require('express')
const router = express.Router()
const db = require('../lib/db.js')
const authJwt = require('../middleware/authJwt')

router.get('/user', [authJwt.verifyToken], (req, res) => {
  const user_id = req.user.user_id
  db.query(`select * from user where user_id = ${user_id};`, (err, data) => {
    if (err) {
      return res.status(400).send({
        code: err.code,
        message: err.message
      })
    } else {
      if (data.length === 0) {
        return res.status(404).send({
          message: 'user_id not found'
        })
      }
      return res.status(200).send(
        data
      )
    }
  })
})

router.get('/user/all', [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
  db.query(`select * from user;`, (err, data) => {
    if (err) {
      return res.status(400).send({
        code: err.code,
        message: err.message
      })
    } else {
      if (data.length === 0) {
        return res.status(404).send({
          message: 'user_id not found'
        })
      }
      return res.status(200).send(
        data
      )
    }
  })
})

router.get(
  '/user/:user_id',
  [authJwt.verifyToken, authJwt.isAdmin],
  (req, res) => {
    const user_id = req.params.user_id
    db.query(`select * from user where user_id = ${user_id};`, (err, data) => {
      if (err) {
        return res.status(400).send({
          code: err.code,
          message: err.message
        })
      } else {
        if (data.length === 0) {
          return res.status(404).send({
            message: 'user_id not found'
          })
        }
        return res.status(200).send(
          data
        )
      }
    })
  }
)

router.patch('/user/:user_id', [authJwt.verifyToken], (req, res) => {
  const user_id = req.params.user_id
  const f_name = req.body.f_name
  const l_name = req.body.l_name
  const username = req.body.username
  const password = req.body.password

  db.query(
    `select user_id from user where user_id = ${user_id};`,
    (err, result) => {
      if (err) {
        return res.status(400).send({
          code: err.code,
          message: err.message
        })
      } else {
        if (result.length === 0) {
          return res.status(404).send({
            message: 'user_id not found'
          })
        } else {
          db.query(
            `update user set f_name = '${f_name}', l_name = '${l_name}', username = '${username}', password = '${password}',
                updated_at = now() where user_id = ${user_id}`,
            (err, result) => {
              if (err) {
                return res.status(400).send({
                  code: err.code,
                  message: err.message
                })
              } else {
                return res.status(200).send({
                  message: 'update succeeded'
                })
              }
            }
          )
        }
      }
    }
  )
})

router.delete('/user/:user_id', [authJwt.verifyToken], (req, res) => {
  const user_id = req.params.user_id
  db.query(
    `select user_id from user where user_id = ${user_id};`,
    (err, result) => {
      if (err) {
        return res.status(400).send({
          code: err.code,
          message: err.message
        })
      } else {
        if (result.length === 0) {
          return res.status(404).send({
            message: 'user_id not found'
          })
        } else {
          db.query(
            `delete from user where user_id = ${user_id}`,
            (err, result) => {
              if (err) {
                return res.status(400).send({
                  code: err.code,
                  message: err.message
                })
              } else {
                return res.status(200).send({
                  message: 'delete succeeded'
                })
              }
            }
          )
        }
      }
    }
  )
})

module.exports = router
