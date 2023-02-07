const express = require('express')
const router = express.Router()
const authJwt = require('../middleware/authJwt')
const db = require('../lib/db.js')

// search StoreUsername
router.get('/store/search/username', [authJwt.verifyToken], (req, res) => {
  const store_username = req.query.store_username
  db.query(
    `select * from store where store_username like '%${store_username}%';`,
    (err, result) => {
      if (err) {
        return res.status(401).send({
          message: err.message,
          code: err.code
        })
      } else {
        return res.status(200).send({
          result,
          total: result.length
        })
      }
    }
  )
})

// search store
router.get('/store/search', (req, res) => {
  const store_username = req.query.store_username
  const store_name = req.query.store_name
  db.query(
    `select * from store where store_username like '%${store_username}%' or store_name like '%${store_name}%';`,
    (err, result) => {
      if (err) {
        return res.status(401).send({
          message: err.message,
          code: err.code
        })
      } else {
        return res.status(200).send({
          result,
          total: result.length
        })
      }
    }
  )
})

// getStore by id
router.get('/store/:store_id', (req, res) => {
  const store_id = req.params.store_id
  db.query(`select * from store where store_id = ${store_id}`, (err, data) => {
    if (err) {
      return res.status(401).send({
        message: err.message
      })
    } else {
      if (data.length === 0) {
        return res.status(404).send({
          message: 'Store not found'
        })
      }
      return res.status(200).send({
        data
      })
    }
  })
})

// getStore All
router.get('/store/all', (req, res) => {
  db.query(`select * from store`, (err, data) => {
    if (err) {
      return res.status(401).send({
        message: err.message
      })
    } else {
      return res.status(200).send({
        data
      })
    }
  })
})

// Create Store Need Token
router.post('/store', [authJwt.verifyToken], (req, res) => {
  const user_id = req.user.user_id
  const store_username = req.body.store_username
  const store_name = req.body.store_name
  db.query(
    `select * from store where store_username = '${store_username}';`,
    (err, data) => {
      if (err) {
        return res.status(401).send({
          message: err.message
        })
      } else {
        if (data.length > 0) {
          return res.status(403).send({
            message: 'store username is already in use'
          })
        } else {
          db.query(
            `insert into store (store_username, store_name) values ('${store_username}', '${store_name}');`,
            (err, result) => {
              if (err) {
                return res.status(401).send({
                  message: err.message
                })
              } else {
                const store_id = result.insertId
                db.query(
                  `insert into user_role (role_id, user_id, store_id) values ( 3, ${user_id}, ${store_id});`,
                  (err, result1) => {
                    if (err) {
                      return res.status(401).send({
                        message: err.message
                      })
                    } else {
                      return res.status(201).send({
                        message: 'Sign up successfully'
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

// Create Store Detail
router.post('/store/:store_id', [authJwt.verifyToken], (req, res) => {
  const user_id = req.user.user_id
  const store_id = req.params.store_id
  const address = req.body.address
  const sub_district = req.body.sub_district
  const district = req.body.district
  const province = req.body.province
  const tel = req.body.tel
  const email = req.body.email
  db.query(
    `select * from user_role where user_id = ${user_id} AND store_id = ${store_id};`,
    (err, data) => {
      if (err) {
        return res.status(401).send({
          message: err.message
        })
      } else {
        if (data.length === 0) {
          return res.status(404).send({
            message: 'Store not found'
          })
        } else {
          db.query(
            `select * from store_detail where store_id = ${store_id};`,
            (err, data1) => {
              if (err) {
                return res.status(401).send({
                  message: err.message
                })
              } else {
                if (data1.length > 0) {
                  return res.status(403).send({
                    message: 'Store Detail already exists'
                  })
                } else {
                  db.query(
                    `insert into store_detail (store_id, address, sub_district, district, province, tel, email) values (${store_id}, '${address}', '${sub_district}', '${district}', '${province}', '${tel}', '${email}');`,
                    (err, result) => {
                      if (err) {
                        return res.status(401).send({
                          message: err.message
                        })
                      } else {
                        return res.status(201).send({
                          message: 'Sign up successfully'
                        })
                      }
                    }
                  )
                }
              }
            }
          )
        }
      }
    }
  )
})

// Update Store Name
router.patch('/store/name/:store_id', [authJwt.verifyToken], (req, res) => {
  const user_id = req.user.user_id
  const store_id = req.params.store_id
  const store_username = req.body.store_username
  const store_name = req.body.store_name

  db.query(`select * from store where store_id = ${store_id};`, (err, data) => {
    if (err) {
      return res.status(401).send({
        message: err.message
      })
    } else {
      if (data.length === 0) {
        return res.status(404).send({
          message: 'Store not found'
        })
      } else {
        if (data[0].store_username === store_username) {
          db.query(
            `update store set store_username = '${store_username}', store_name = '${store_name}' where store_id = '${store_id}';`,
            (err, result) => {
              if (err) {
                return res.status(401).send({
                  message: err.message
                })
              } else {
                return res.status(200).send({
                  message: 'Update successfully'
                })
              }
            }
          )
        } else {
          db.query(
            `select * from store where store_username = '${store_username}';`,
            (err, data1) => {
              if (err) {
                return res.status(401).send({
                  message: err.message
                })
              } else {
                if (data1.length > 0) {
                  return res.status(403).send({
                    message: 'Store Username is already'
                  })
                } else {
                  db.query(
                    `update store set store_username = '${store_username}', store_name = '${store_name}' where store_id = '${store_id}';`,
                    (err, result) => {
                      if (err) {
                        return res.status(401).send({
                          message: err.message
                        })
                      } else {
                        return res.status(200).send({
                          message: 'Update successfully'
                        })
                      }
                    }
                  )
                }
              }
            }
          )
        }
      }
    }
  })
})

// Update Store Detail
router.patch('/store/detail/:store_id', [authJwt.verifyToken], (req, res) => {
  const user_id = req.user.user_id
  const store_id = req.params.store_id
  const address = req.body.address
  const sub_district = req.body.sub_district
  const district = req.body.district
  const province = req.body.province
  const tel = req.body.tel
  const email = req.body.email

  db.query(`select * from store where store_id = ${store_id};`, (err, data) => {
    if (err) {
      return res.status(401).send({
        message: err.message
      })
    } else {
      if (data.length === 0) {
        return res.status(404).send({
          message: 'Store not found'
        })
      } else {
        db.query(
          `update store_detail set address = '${address}', sub_district = '${sub_district}', district = '${district}', province = '${province}', tel = '${tel}', email = '${email}' where store_id = ${store_id};`,
          (err, result) => {
            if (err) {
              return res.status(401).send({
                message: err.message
              })
            } else {
              return res.status(200).send({
                message: 'Updated successfully'
              })
            }
          }
        )
      }
    }
  })
})

// User Request Delete Store
router.patch('/store/del/:store_id', [authJwt.verifyToken], (req, res) => {
  const user_id = req.user.user_id
  const store_id = req.params.store_id
  const del_note = req.body.del_note
  db.query(
    `select * from user_role where user_id = ${user_id} and store_id = ${store_id};`,
    (err, data) => {
      if (err) {
        return res.status(401).send({
          message: err.message
        })
      } else {
        if (data.length === 0) {
          return res.status(404).send({
            message:
              'User does not have permission to request. Please Login by shop owner'
          })
        }
        db.query(
          `select * from store where store_id = ${store_id};`,
          (err, data1) => {
            if (err) {
              return res.status(401).send({
                message: err.message
              })
            } else {
              if (data1.length === 0) {
                return res.status(404).send({
                  message: 'Store not found'
                })
              } else {
                db.query(
                  `update store set store_del_status = 1, store_del_note = '${del_note}' where store_id = ${store_id};`,
                  (err, result) => {
                    if (err) {
                      return res.status(401).send({
                        message: err.message
                      })
                    } else {
                      return res.status(200).send({
                        message: 'User Request Delete Store successfully'
                      })
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
})

// User Cancel Request Delete Store
router.patch('/store/cancel/:store_id', [authJwt.verifyToken], (req, res) => {
  const user_id = req.user.user_id
  const store_id = req.params.store_id
  db.query(
    `select * from user_role where user_id = ${user_id} and store_id = ${store_id};`,
    (err, data) => {
      if (err) {
        return res.status(401).send({
          message: err.message
        })
      } else {
        if (data.length === 0) {
          return res.status(404).send({
            message:
              'User does not have permission to request. Please Login by shop owner'
          })
        }
        db.query(
          `select * from store where store_id = ${store_id};`,
          (err, data1) => {
            if (err) {
              return res.status(401).send({
                message: err.message
              })
            } else {
              if (data1.length === 0) {
                return res.status(404).send({
                  message: 'Store not found'
                })
              } else {
                db.query(
                  `update store set store_del_status = 0, store_del_note = '' where store_id = ${store_id};`,
                  (err, result) => {
                    if (err) {
                      return res.status(401).send({
                        message: err.message
                      })
                    } else {
                      return res.status(200).send({
                        message: 'User Cancel Request Delete Store successfully'
                      })
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
})

// Delete By Admin
router.delete(
  '/store/del/:store_id',
  [authJwt.verifyToken, authJwt.isAdmin],
  (req, res) => {
    const store_id = req.params.store_id
    db.query(
      `select * from store where store_id = ${store_id};`,
      (err, data) => {
        if (err) {
          return res.status(401).send({
            message: err.message
          })
        } else {
          if (data.length === 0) {
            return res.status(404).send({
              message: 'Store not found'
            })
          } else {
            db.query(
              `DELETE FROM store WHERE store_id = ${store_id};`,
              (err, result) => {
                if (err) {
                  return res.status(401).send({
                    message: err.message
                  })
                } else {
                  return res.status(200).send({
                    message: 'Deleted store successfully'
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

// export
module.exports = router
