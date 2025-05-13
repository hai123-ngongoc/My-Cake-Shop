const Minio = require('minio');

const client = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'KyoQ1YIdBQ20TIXGyLFN',
    secretKey: 'kxMrVfLUgrXIzKkaiSG02xQcP3bSw2mEeJRLDkO5'
});
const BUCKET = 'my-bucket';

const upload = async (req, res, next) => {
    try {
        client.presignedPutObject(BUCKET, req.query.name, (err, url) => {
            if (err) throw err
            res.end(url)
        });
    } catch (error) {
        next(error);
    }
};

const view = async (req, res, next) => {
    try {
        client.presignedGetObject(BUCKET, req.query.name, (err, url) => {
            if (err) throw err
            res.redirect(url);
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    upload,
    view,
};