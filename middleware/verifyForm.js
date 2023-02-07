module.exports = {
  ReqOTP: (req, res, next) => {
    if (!req.body.tel && !req.body.user_address_id) {
      return res.status(400).send({
        message: 'Enter Tel and user_address_id'
      })
    } else if (!req.body.tel) {
      return res.status(400).send({
        message: 'Enter Tel'
      })
    } else if (!req.body.user_address_id) {
      return res.status(400).send({
        message: 'Enter user_address_id'
      })
    } else {
      next()
    }
  },
  verifyOTP: (req, res, next) => {
    if (!req.body.otp && !req.body.user_address_id) {
      return res.status(400).send({
        message: 'Enter OTP and user_address_id'
      })
    } else if (!req.body.otp) {
      return res.status(400).send({
        message: 'Enter OTP'
      })
    } else if (!req.body.user_address_id) {
      return res.status(400).send({
        message: 'Enter user_address_id'
      })
    } else {
      next()
    }
  },
  Useradd: (req, res, next) => {
    if (!req.params.user_address_id) {
      return res.status(400).send({
        message: 'Enter Params user_address_id'
      })
    } else if (
      !req.body.title &&
      !req.body.address &&
      !req.body.sub_district &&
      !req.body.district &&
      !req.body.province &&
      !req.body.tel
    ) {
      return res.status(400).send({
        message:
          'Enter title or address or sub_district or district or province or tel'
      })
    } else {
      next()
    }
  },
  Useradd_del: (req, res, next) => {
    if (!req.params.user_address_id) {
      return res.status(400).send({
        message: 'Enter Params user_address_id'
      })
    } else {
      next()
    }
  }
}
