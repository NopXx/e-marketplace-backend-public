const express = require('express');
const app = express();
require('dotenv').config()
const cors = require('cors');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000

app.use(bodyParser.json({ limit: "50mb" }));

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(
    cors({
        origin: "*",
        method: ["GET", "POST", "PATCH", "DELETE"],
    })
)
app.get('/', (req, res) => {
    res.send('Hello, world')
})

app.get('/api', (req, res) => {
  return res.status(200).send({
    git: 'https://github.com/NopXx/e-marketplace-backend.git'
  })
})

const auth = require("./routes/Auth.js");
const role = require("./routes/Role");
const user_add = require("./routes/UserAdd");
const user_role = require("./routes/UserRole");
const otp = require("./routes/Otp")
const user = require("./routes/User");
const store = require("./routes/Store");
const product = require("./routes/Product")
const product_ty = require("./routes/ProductTy")
const upload = require("./routes/Upload")
const image = require("./routes/Image")
const userfollow = require("./routes/UserFollow")
app.use("/api/auth", auth);
app.use("/api", [role, user_add, otp, user_role, user, store, product, product_ty, upload, image, userfollow]);

app.listen(port, () => {
    console.log('server on port http://localhost:' + port);
})