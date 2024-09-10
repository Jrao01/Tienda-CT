const multer = require('multer');
const path = require('path');

const MIMETYPES = ['image/jpg','image/jpeg', 'image/png'];


let upload = multer({
    storage: multer.diskStorage({

        destination: function (req, file, cb) {
            cb(null, './public/uploads')
        },
        filename: function (req, file, cb) {
            let ext = path.extname(file.originalname);
            cb(null, 'img-' + Date.now() + ext)
        },

    }),
    fileFilter: (req, file, cb) => {
        if (MIMETYPES.includes(file.mimetype)) cb(null, true)
        else cb(new Error(`solo ${MIMETYPES.join(' ')}son permitidos`))
    },
    limits: {
        fieldSize: 100000000,
    },
});

module.exports = upload;