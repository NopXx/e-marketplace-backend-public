const express = require('express')
const router = express.Router()
const authJwt = require('../middleware/authJwt')
const db = require('../lib/db.js')
const userMiddleware = require('../middleware/user')

router.get('/role', [authJwt.verifyToken], (req, res) => {
  const user_id = req.user.user_id
  db.query(
    `SELECT user_role.user_id, user_role.role_id, role.role_name, store.store_id
    FROM user_role 
      LEFT JOIN role ON user_role.role_id = role.role_id 
      LEFT JOIN store ON user_role.store_id = store.store_id
    WHERE user_role.user_id = ${user_id}`,
    (err, data) => {
      if (err) {
        return res.status(401).send({
          message: err
        })
      } else {
        return res.status(200).send(
          data
        )
      }
    }
  )
})

router.get('/role/all', [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
  db.query('SELECT * FROM role', (err, data) => {
    if (err) {
      return res.status(401).send({
        message: err
      })
    } else {
      return res.status(200).send({
        data,
        totle: data.length
      })
    }
  })
})

router.post('/role', [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
  const role_name = req.body.role_name
  if (!role_name) {
    const mes = {
      message: 'Enter role name'
    }
    res.setHeader('Content-Type', 'application/json')
    res.status(400)
    console.log(mes)
    res.json(mes)
  } else {
    db.query(
      `INSERT INTO role (role_name) VALUES ("${role_name}") ;`,
      (err, result) => {
        if (err) {
          res.send(err)
        } else {
          res.send('insert succeeded')
        }
      }
    )
  }
})

router.patch(
  '/role/:role_id',
  [authJwt.verifyToken, authJwt.isAdmin],
  (req, res) => {
    const role_id = req.params.role_id
    const role_name = req.body.role_name
    if (!role_id && !role_name) {
      const mes = {
        message: 'Enter role id and role name'
      }
      res.setHeader('Content-Type', 'application/json')
      res.status(400)
      console.log(mes)
      res.json(mes)
    } else if (!role_id) {
      const mes = {
        message: 'Enter role id'
      }
      res.setHeader('Content-Type', 'application/json')
      res.status(400)
      console.log(mes)
      res.json(mes)
    } else if (!role_name) {
      const mes = {
        message: 'Enter role name'
      }
      res.setHeader('Content-Type', 'application/json')
      res.status(400)
      console.log(mes)
      res.json(mes)
    } else {
      db.query(
        `SELECT role_id FROM role WHERE role_id = ${role_id} ;`,
        (err, result) => {
          if (err) {
            res.send(err)
          } else {
            //   console.log(result.length);
            if (result.length === 0) {
              const mes = {
                message: 'role id not found'
              }
              res.setHeader('Content-Type', 'application/json')
              res.status(400)
              console.log(mes)
              res.json(mes)
            } else {
              db.query(
                `UPDATE role SET role_name = "${role_name}" WHERE role_id = "${role_id}" ;`,
                (err, result) => {
                  if (err) {
                    res.send(err)
                  } else {
                    res.send(`update role_id ${role_id} succeeded`)
                  }
                }
              )
            }
          }
        }
      )
    }
  }
)

router.delete(
  '/role/:role_id',
  [authJwt.verifyToken, authJwt.isAdmin],
  (req, res) => {
    const role_id = req.params.role_id
    if (!role_id) {
      const mes = {
        message: 'Enter role id'
      }
      res.setHeader('Content-Type', 'application/json')
      res.status(400)
      console.log(mes)
      res.json(mes)
    } else {
      db.query(
        `SELECT role_id FROM role WHERE role_id = ${role_id} ;`,
        (err, result) => {
          if (err) {
            res.send(err)
          } else {
            if (result.length === 0) {
              const mes = {
                message: 'role id not found'
              }
              res.setHeader('Content-Type', 'application/json')
              res.status(400)
              console.log(mes)
              res.json(mes)
            } else {
              db.query(
                `DELETE FROM role WHERE role_id = ${role_id} ;`,
                (err, result) => {
                  if (err) {
                    res.send(err)
                  } else {
                    res.send(`delete role_id ${role_id} succeeded`)
                  }
                }
              )
            }
          }
        }
      )
    }
  }
)

module.exports = router
