const jwt = require('jsonwebtoken')

function validateToken(req, res, next) {
    const accessToken = req.header('Authorization');
    const headers = req.headers;
    console.log(headers)
    if (!accessToken) {
        console.log('accesstoken:',accessToken)
        res.redirect('/');
        console.log('error obteniendo el token de verificacion, acceso denegado');
        return; 
    } else {
        jwt.verify(accessToken, process.env.SECRETKEY, (err, user) => {
            if (err) {
                console.log('error verificando el token, token invalido o expirado');
                res.redirect('/');
                return; 
            } else {
                next();
            }
        });
    }
}

module.exports = validateToken;