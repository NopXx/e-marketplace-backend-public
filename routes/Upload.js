const express = require('express')
const router = express.Router()
const authJwt = require('../middleware/authJwt')
const db = require('../lib/db.js')
const cloudinary = require('../lib/cloudinary')
const upload = require('../lib/multer')

// upload product image
router.post(
  '/upload/product',
  upload.single('image'),
  [authJwt.verifyToken, authJwt.isStore],
  async (req, res) => {
    const product_id = req.body.product_id
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'image'
      })

      db.query(
        `select * from db_image where product_id = ${product_id};`,
        (err, result1) => {
          if (err) {
            return res.status(401).send({
              message: err.message
            })
          } else {
            if (result1.length === 0) {
              db.query(
                `insert into db_image (img_id, product_id, image, created_at, default_image) values ('${result.public_id}',${product_id}, '${result.url}', "${result.created_at}", 1);`,
                (err, result2) => {
                  if (err) {
                    return res.status(401).send({
                      message: err.message
                    })
                  } else {
                    return res.status(200).send({
                      message: 'inserted successfully'
                    })
                  }
                }
              )
            } else {
              db.query(
                `insert into db_image (img_id, product_id, image, created_at) values ('${result.public_id}',${product_id}, '${result.url}', "${result.created_at}");`,
                (err, result2) => {
                  if (err) {
                    return res.status(401).send({
                      message: err.message
                    })
                  } else {
                    return res.status(200).send({
                      message: 'inserted successfully'
                    })
                  }
                }
              )
            }
          }
        }
      )
    } catch (err) {
      console.error(err)
      res.status(500).json({ err: 'Something went wrong' })
    }
  }
)

// upload product type image
router.post(
  '/upload/product-type',
  upload.single('image'),
  [authJwt.verifyToken, authJwt.isAdmin],
  async (req, res) => {
    const product_type_id = req.body.product_type_id
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'image'
      })
      db.query(
        `select * from db_image where product_type_id = ${product_type_id};`,
        (err, result1) => {
          if (err) {
            return res.status(401).send({
              message: err.message
            })
          } else {
            if (result1.length === 0) {
              db.query(
                `insert into db_image (img_id, product_type_id, image, created_at, default_image) values ('${result.public_id}',${product_type_id}, '${result.url}', "${result.created_at}", 1);`,
                (err, result) => {
                  if (err) {
                    return res.status(401).send({
                      message: err.message
                    })
                  } else {
                    return res.status(200).send({
                      message: 'inserted successfully'
                    })
                  }
                }
              )
            } else {
              db.query(
                `insert into db_image (img_id, product_type_id, image, created_at) values ('${result.public_id}',${product_type_id}, '${result.url}', "${result.created_at}");`,
                (err, result) => {
                  if (err) {
                    return res.status(401).send({
                      message: err.message
                    })
                  } else {
                    return res.status(200).send({
                      message: 'inserted successfully'
                    })
                  }
                }
              )
            }
          }
        }
      )
    } catch (err) {
      console.error(err)
      res.status(500).json({ err: 'Something went wrong' })
    }
  }
)

// get detail
router.post('/upload/product/detail', async (req, res) => {
  const id = req.body.id
  try {
    const result = await cloudinary.api.resource(id)
    console.log(result)
    res.status(200).json(result)
  } catch (err) {
    res.status(500).send({
      message: err
    })
  }
})


module.exports = router
