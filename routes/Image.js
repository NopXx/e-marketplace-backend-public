const express = require('express')
const router = express.Router()
const authJwt = require('../middleware/authJwt')
const db = require('../lib/db.js')
const cloudinary = require('../lib/cloudinary')

// get product image
router.get('/image/product/:id', (req, res) => {
  db.query(
    `select * from db_image where product_id = ${req.params.id} ORDER BY default_image DESC`,
    (err, data) => {
      if (err) {
        return res.status(401).send({
          message: err.message
        })
      } else {
        return res.status(200).json(data)
      }
    }
  )
})

// update product image default
router.patch(
  '/image/product/:id',
  [authJwt.verifyToken, authJwt.isStore],
  (req, res) => {
    const id = req.params.id
    const img_id = req.body.img_id
    db.query(
      `select * from db_image where img_id = '${img_id}'`,
      (err, data) => {
        if (err) {
          return res.status(401).send({ message: err.message })
        } else {
          if (data.length > 0) {
            db.query(
              `update db_image set default_image = 0 where product_id = ${id}`,
              (err, data1) => {
                if (err) {
                  return res.status(401).send({
                    message: err.message
                  })
                } else {
                  db.query(
                    `update db_image set default_image = 1 where img_id = '${img_id}'`,
                    (err, data2) => {
                      if (err) {
                        return res.status(401).send({
                          message: err.message
                        })
                      } else {
                        return res.status(200).send({
                          message: 'updated default image successfully'
                        })
                      }
                    }
                  )
                }
              }
            )
          } else {
            return res.status(404).send({
              message: 'Image not found'
            })
          }
        }
      }
    )
  }
)

// delete image
router.delete(
  '/image/delete',
  [authJwt.verifyToken, authJwt.isStore],
  async (req, res) => {
    const id = req.body.id
    console.log(req.body.id)
    try {
      const result = await cloudinary.uploader.destroy(id)
      db.query(
        `delete from db_image where img_id = '${id}';`,
        (err, result) => {
          if (err) {
            return res.status(401).send({
              message: err.message
            })
          } else {
            return res.status(200).send({
              message: 'Delete image successfully'
            })
          }
        }
      )
    } catch (err) {
      res.status(500).send({
        message: err
      })
    }
  }
)

module.exports = router
