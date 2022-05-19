import { Request, Response } from "express";
const pool = require("../mysql/database");
const fetch = require("node-fetch");
export const putToken = async (req: Request, res: Response) => {
  try {
    const { id_rol, token, tipo_rol } = req.body;
    if(tipo_rol === 'pasajero'){
        const pasajero = await pool.query(
            `UPDATE  pasajero SET token = '${token}' WHERE  id_pasajero = '${id_rol}'`
          );
          console.log(pasajero)
            res.json({
                "msg": 'Token actualizado.'
         });
    }

    if(tipo_rol === 'conductor'){
        const conductor = await pool.query(
            `UPDATE  conductor SET  token  = '${token}' WHERE  id_conductor = '${id_rol}'`
          );
        
          console.log(conductor)
            res.json({
                "msg": 'Token actualizado.'
         });
    }


  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};

export const getTokenDrivers = async (req: Request, res: Response) => {
  try {
   
    const query = await pool.query(`SELECT token from conductor WHERE conductor.token != '' AND conductor.estado = 'activo'; `);
    console.log(query)
    res.status(200).json({
      tokens: query,
    });

  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};

export const pushNotification = async (req: Request, res: Response) => {

          const {token,titulo,descripcion} = req.body;
          var notificationContext = {
            "title":titulo,
            "body":descripcion,
            "activity":"RequestwebActivity"
           
          }
          var notificationReady = {
              "to":token,
              "data":notificationContext
          }

          fetch('https://fcm.googleapis.com/fcm/send',{
              method:'POST',
              headers:{
                  'Content-Type':'application/json',
                  'Authorization':'key=AAAAveH3aIY:APA91bH3WOkr_KBuCWO7nw76wcWUDX3bezw6atLsZhHwtbSMA27PBPyelJNenwsrIH5ExTxXpz7Yr8vrd1HGCm5HOZMtXcaINimP0dNdddflkXYhF64geQdwDjfFC_y6mvXwiVgBSnB9',
              },
              body:JSON.stringify(notificationReady)
          }).then((response:any)=>{
              if(response.status === 200){
               res.status(200).json({
                  "msg":'Notificacion enviada.'
               });
            }
          }).catch((error:any)=>{
              res.status(500).json({
                  "msg":'Algo salió mal, hable con el administrador.'
              });
          })

};

export const getDriverEmergency = async (req: Request, res: Response) => {
  try {
  
    const query = await pool.query(`
    SELECT CONCAT(PE.nombres, " ",PE.apellidos) as "conductor",PE.telefono,
     PE.foto,PE.nmr_documento,CO.latitud, CO.longitud from conductor CO
     INNER JOIN persona PE ON CO.id_persona = PE.id_persona WHERE CO.estado = 'emergencia';
    `);

    if(query.length > 0){
       res.status(200).json({
       conductores: query
      })
    }

  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador!.",
    });
  }
};



export const driverStateEmergency = async (req: Request, res: Response) => {
  const {id_conductor} = req.body;
  try {
    const query = await pool.query(`
    UPDATE conductor SET  estado = 'emergencia' WHERE  id_conductor = '${id_conductor}'
    `);
   if(query.affectedRows > 0){
    res.status(200).json({
      "msg": 'Estado actualizado a emergencia.'
   });
  }
   
  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};
