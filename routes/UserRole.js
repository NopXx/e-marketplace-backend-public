const express = require('express')
const router = express.Router()
const db = require('../lib/db.js')
const authJwt = require('../middleware/authJwt')

// get all
router.get('/userrole', [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
  db.query(
    `SELECT user_role.user_id, user_role.role_id, role.role_name
FROM user_role 
  LEFT JOIN role ON user_role.role_id = role.role_id;`,
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
          return res.status(200).send({
            data: result,
            total: result.length
          })
        }
      }
    }
  )
})
// get by id
router.get(
  '/userrole/:user_id',
  [authJwt.verifyToken, authJwt.isAdmin],
  (req, res) => {
    const user_id = req.params.user_id
    db.query(
      `SELECT user_role.user_id, user_role.role_id, role.role_name
  FROM user_role 
    LEFT JOIN role ON user_role.role_id = role.role_id
  WHERE user_role.user_id = ${user_id};`,
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
            return res.status(200).send({
              data: result,
              total: result.length
            })
          }
        }
      }
    )
  }
)

router.patch(
  '/userrole/:user_id',
  [authJwt.verifyToken, authJwt.isAdmin],
  (req, res) => {
    const user_id = req.params.user_id
    const role_id = req.body.role_id
    const user_role_id = req.body.user_role_id
    db.query(
      `select * from user_role where user_id = ${user_id} AND user_role_id = ${user_role_id};`,
      (err, result) => {
        if (err) {
          return res.status(400).send({
            code: err.code,
            message: err.message
          })
        } else {
          if (result.length === 0) {
            return res.status(403).send({
              message: 'user_id or user_role_id not found'
            })
          } else {
            db.query(
              `update user_role set role_id = ${role_id} where user_id = ${user_id} AND user_role_id = ${user_role_id};`,
              (err, result) => {
                if (err) {
                  return res.status(400).send({
                    code: err.code,
                    message: err.message
                  })
                } else {
                  db.query(
                    `update user set updated_at = now() where user_id = ${user_id}`
                  )
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
  }
)

module.exports = router
