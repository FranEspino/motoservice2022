import { Request, Response } from "express";
import { generaJWT } from "../helpers/genera-jwt";
const pool = require("../mysql/database");

export const getLogin = async (req: Request, res: Response) => {
  const { usuario, clave } = req.body;
  try {
    if (!usuario || !clave) {
      return res.status(400).json({
        msg: "Debe ingresar todos los datos.",
      });
    } else {
      const user = await pool.query(
        `SELECT id_cuenta,estado, cod_rol FROM cuenta WHERE usuario = '${usuario}' AND clave = '${clave}'`
      );
      if (user.length > 0) {
        if (user[0].estado === "activo") {
            //pasajero
            if (user[0].cod_rol === 1000) {

              const passenger = await pool.query(
                ` SELECT PE.id_persona, PA.estado, PA.id_pasajero as 'id_rol', PE.nombres, PE.apellidos, PE.nmr_documento,
                  PE.telefono, PE.direccion, PE.email, PE.sexo, PE.foto, PE.fnacimiento
                 FROM persona PE INNER JOIN pasajero PA ON PE.id_persona 
                  = PA.id_persona WHERE PA.id_cuenta = '${user[0].id_cuenta}'`
              )

              res.json({
                "login": passenger,
                "rol": 'pasajero'
              });
            }
            //conductor
            if (user[0].cod_rol === 2000) {
              const driver = await pool.query(
                ` SELECT PE.id_persona, CO.estado,CO.id_conductor as 'id_rol', PE.nombres, PE.apellidos, PE.nmr_documento, 
                PE.telefono, PE.direccion, PE.email, PE.sexo, PE.foto, PE.fnacimiento 
                FROM persona PE INNER JOIN conductor CO ON PE.id_persona
                 = CO.id_persona WHERE CO.id_cuenta = '${user[0].id_cuenta}'`
              )

              res.json({
                "login": driver,
                "rol": 'conductor'
              });

            }
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};



export const loginSystem = async (req: Request, res: Response) => {
  const { usuario, clave } = req.body;
  try {
    const login = await pool.query(
      `SELECT id_cuenta,estado, cod_rol FROM cuenta WHERE usuario = '${usuario}' AND clave = '${clave}'`
    );
  const token = await generaJWT(login[0].id_cuenta);
    
   if(login.length > 0){
        res.json({
          "token": token,
          "rol": login[0].cod_rol}
        );
   }else{   
    res.status(400).json({
      msg: "Usuario o contraseña incorrectos.",
    });
   } 
     
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};



