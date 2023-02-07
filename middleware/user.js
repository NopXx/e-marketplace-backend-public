module.exports = {
    validateRegister: (req, res, next) => {
        if (!req.body.username || !req.body.password) {
            return res.status(400).send({
                msg: "enter ussername and password",
            });
        }
        next();
    },
    isLoggedIn: (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
            if (!token) {
                throw new Error('Authentication failed!');
            }
            const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = verified;
            next();
        } catch (err) {
            res.status(400).send('Invalid token !');
        }
    },
};