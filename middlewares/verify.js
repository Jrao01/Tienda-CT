const jwt = require('jsonwebtoken');
//const Cookies = require('js-cookie')

function validateToken( req, res, next) {

    const accessToken = req.cookies['accessToken'];
    console.log(accessToken);
    if (!accessToken) {
        console.log('accesstoken:', accessToken);
        res.redirect('/');
        console.log('error obteniendo el token de verificacion, acceso denegado');
        return;
    } else {
        jwt.verify(accessToken, process.env.SECRETKEY, ( err, decoded ) => {
            if (err) {
                console.log('accesstoken:', accessToken);
                console.log('decoded-token:', decoded);
                console.log('error verificando el token, token invalido o expirado');
                res.redirect('/');
                return;
            } else {
                console.log('decoded-token:', decoded);
                next();
            }
        });
    }
}

module.exports = validateToken