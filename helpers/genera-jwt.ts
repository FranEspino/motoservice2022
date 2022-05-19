import jwt from 'jsonwebtoken';

//WRITE A FUNCTION A JWT TOKEN
export const generaJWT = (id:number) => {
    return new Promise((resolve, reject) => {
        const payload = { id };
        jwt.sign(payload,
            `${process.env.SECRETORPUBLICKEY }`,{
            expiresIn: '30d'
        }, (err, token) => {
            if (err) {
                reject('No se pudo generr el JWT: ' + err);
            } else {
                resolve(token);
            }
        })
    });
}
module.exports = {
    generaJWT
}