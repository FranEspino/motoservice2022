import jwt from 'jsonwebtoken';
import express, {Request, Response} from 'express';

 const validaJWT = (req:Request, res:Response,next:Function) => {
    const token = req.header('x-token') as string ;

    if(!token){
        return res.status(401).json({
            msg: "No hay token en la petición."
        });
    }

    try {
        jwt.verify(token, process.env.SECRETORPUBLICKEY || '');
        next();
    } catch (error) {
        
       res.status(401).json({
              msg: "Token no válido."+error
       });
    }
};
export default validaJWT;