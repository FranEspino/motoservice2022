import { Request, Response } from "express";
const pool = require("../mysql/database");

export const getHistoryPassenger = async (req: Request, res: Response) => {
  try {
    const {id_type} = req.body;
    const query = await pool.query(
      `SELECT LO.direccion_actual, LO.direccion_destino, VI.fechayhora_inicio as 'fechayhora',
       CONCAT(PE.nombres," ", PE.apellidos) as 'nombre', PE.telefono, PE.foto FROM viaje VI
       INNER JOIN solicitud SO ON VI.id_solicitud = SO.id_solicitud INNER JOIN localizacion LO
       ON SO.id_localizacion = LO.id_localizacion INNER JOIN conductor CO ON VI.id_conductor 
       = CO.id_conductor INNER JOIN persona PE ON CO.id_persona = PE.id_persona WHERE SO.id_pasajero
        ='${id_type}' AND VI.estado = "terminado" ORDER BY(VI.fechayhora_inicio) DESC LIMIT 10;`
    );
    res.status(200).json({
      historial : query
    });
  
  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};

export const getHistoryCustomPassenger = async (req: Request, res: Response) => {
  try {
    const {id_type, date} = req.body;
    const query = await pool.query(
      `SELECT LO.direccion_actual, LO.direccion_destino, VI.fechayhora_inicio as 'fechayhora', 
      CONCAT(PE.nombres," ", PE.apellidos) as 'nombre', PE.telefono, PE.foto FROM viaje VI INNER JOIN 
      solicitud SO ON VI.id_solicitud = SO.id_solicitud INNER JOIN localizacion LO ON SO.id_localizacion 
      = LO.id_localizacion INNER JOIN conductor CO ON VI.id_conductor = CO.id_conductor INNER JOIN 
      persona PE ON CO.id_persona = PE.id_persona WHERE SO.id_pasajero ='${id_type}' AND VI.estado = "terminado"
       AND DATE(VI.fechayhora_inicio) = '${date}' ORDER BY(VI.fechayhora_inicio) DESC;`
    );
    res.status(200).json({
      historial : query
    });
  
  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};
export const getHistoryDriver = async (req: Request, res: Response) => {
    try {
      const {id_type} = req.body;
      const query = await pool.query(
        `SELECT LO.direccion_actual, LO.direccion_destino, VI.fechayhora_inicio as 'fechayhora',
         CONCAT(PE.nombres," ", PE.apellidos) as 'nombre', PE.telefono, PE.foto FROM viaje VI 
         INNER JOIN solicitud SO ON VI.id_solicitud = SO.id_solicitud INNER JOIN localizacion LO
        ON SO.id_localizacion = LO.id_localizacion INNER JOIN pasajero PA ON SO.id_pasajero = 
        PA.id_pasajero INNER JOIN persona PE ON PA.id_persona = PE.id_persona WHERE VI.id_conductor 
        ='${id_type}' AND VI.estado = "terminado" ORDER BY(VI.fechayhora_inicio) DESC LIMIT 10;`
      );
      res.status(200).json({
        historial : query
      });
    
    } catch (error) {
      res.status(500).json({
        msg: "Algo salió mal, hable con el administrador.",
      });
    }
  };

  export const getHistoryCustomDriver = async (req: Request, res: Response) => {
    try {
      const {id_type,date} = req.body;
      const query = await pool.query(
        `SELECT LO.direccion_actual, LO.direccion_destino, VI.fechayhora_inicio as 'fechayhora',
        CONCAT(PE.nombres," ", PE.apellidos) as 'nombre', PE.telefono, PE.foto FROM viaje VI 
        INNER JOIN solicitud SO ON VI.id_solicitud = SO.id_solicitud INNER JOIN localizacion LO
       ON SO.id_localizacion = LO.id_localizacion INNER JOIN pasajero PA ON SO.id_pasajero = 
       PA.id_pasajero INNER JOIN persona PE ON PA.id_persona = PE.id_persona WHERE VI.id_conductor 
       ='${id_type}' AND VI.estado = "terminado" AND DATE(VI.fechayhora_inicio) = '${date}'
       ORDER BY(VI.fechayhora_inicio) DESC;`
      );
      res.status(200).json({
        historial : query
      });
    
    } catch (error) {
      res.status(500).json({
        msg: "Algo salió mal, hable con el administrador.",
      });
    }
  };


  export const getHistoryWeb = async (req: Request, res: Response) => {
    try {
      const {id_type} = req.body;
      const query = await pool.query(
        `SELECT SW.nombre,SW.telefono, SW.direccion_origen as 'direccion', SW.referencia as 'datos',
         VW.fechayhora_inicio as 'fecha' from viajeweb VW INNER JOIN solicitudweb SW ON 
         VW.id_solicitudweb = SW.id_solicitudweb WHERE VW.id_conductor = '${id_type}' AND VW.estado 
         = "terminado" ORDER BY(VW.fechayhora_inicio) DESC LIMIT 10;`
      );
      res.status(200).json({
        historial : query
      });
    
    } catch (error) {
      res.status(500).json({
        msg: "Algo salió mal, hable con el administrador.",
      });
    }
  };


  export const getHistoryCustomWeb = async (req: Request, res: Response) => {
    try {
      const {id_type,date} = req.body;
      const query = await pool.query(
        `SELECT SW.nombre,SW.telefono, SW.direccion_origen as 'direccion', SW.referencia as 'datos', 
        VW.fechayhora_inicio as 'fecha' from viajeweb VW INNER JOIN solicitudweb SW ON VW.id_solicitudweb
         = SW.id_solicitudweb WHERE VW.id_conductor = '${id_type}' AND VW.estado = "terminado" AND 
         DATE(VW.fechayhora_inicio) = '${date}' ORDER BY(VW.fechayhora_inicio) DESC;
        `
      );
      res.status(200).json({
        historial : query
      });
    
    } catch (error) {
      res.status(500).json({
        msg: "Algo salió mal, hable con el administrador.",
      });
    }
  };

  
export const insertFrecuentPlace = async (req: Request, res: Response) => {
  try {
    const { id_pasajero , titulo, lat, long} = req.body;
    const query = await pool.query(
      `INSERT INTO lugares_frecuentes(id_pasajero,latitud,longitud,titulo) 
      VALUES('${id_pasajero}','${lat}','${long}','${titulo}')`
    );
    if(query.affectedRows > 0) {
      res.status(200).json({
        message: "Se agrego lugar frecuente."
      });
    
    }else{
      res.status(500).json({
        message: "Ocurrio un error, revisa bien los datos."
      });
    }


  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador de la db.",
    });
  }
};


export const getFrecuentPlace = async (req: Request, res: Response) => {
  try {
    const { id_pasajero} = req.body;
    const query = await pool.query(
      `SELECT * FROM lugares_frecuentes LF WHERE LF.id_pasajero = '${id_pasajero}' 
      ORDER BY(LF.fechayhora) DESC`
    );
    if(query.length > 0){
      
      res.status(200).json({
        lugares: query  
      });
    }


  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador de la db.",
    });
  }
};


export const deletePlace= async (req: Request, res: Response) => {
  try {
    const {id_lugarfrecuente} = req.body;
    const query = await pool.query(
      `DELETE FROM lugares_frecuentes LF WHERE LF.id_lugarfrecuente = '${id_lugarfrecuente}'`
    );
    if(query.affectedRows > 0) {
      res.status(200).json({
        message: "Lugar frecuente eliminado correctamente."
      });
    
    }else{
      res.status(500).json({
        message: "Ocurrio un error, revisa bien los datos."
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador de la db.",
    });
  }
};