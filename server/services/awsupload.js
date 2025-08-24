const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");


aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: 'us-east-2'
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(new Error('Only jpeg or png are supported!'), false)
    }
}

const upload = multer({
    fileFilter: fileFilter,
    storage: multerS3({
        s3: s3,
        bucket: 'quarrel-images',
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, {fieldName: 'hello world!'});
        },
        key: (req, file, cb) => {
            cb(null, Date.now().toString())
        }
    })
});

module.exports = upload;