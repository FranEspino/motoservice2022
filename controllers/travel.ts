import { Request, Response } from "express";
const pool = require("../mysql/database");

export const postTravel = async (req: Request, res: Response) => {
  try {
    const { id_solicitud, id_conductor, precio_final } = req.body;
    const stateRequest = await pool.query(`SELECT estado FROM solicitud WHERE id_solicitud = ${id_solicitud}`);
    const estado = stateRequest[0].estado
    if (estado=== "pendiente") {
      const newTravel = await pool.query(
        `CALL NUEVO_VIAJE(
          '${id_solicitud}',
          '${id_conductor}',
          '${precio_final}'
        );`
      );
      res.status(200).json({
        id_viaje: newTravel[0][0].id_viaje,
      });
    }else{
        res.status(500).json({
          message: "Lo sentimos, La solicitud web ya aceptada",
      });
    }

  
  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};

export const postTravelAcept = async (req: Request, res: Response) => {
  try {
    const { id_viaje } = req.body;
    const query = await pool.query(
      `CALL ACEPTAR_VIAJE(
        '${id_viaje}'
      );`
    );
    if (query.serverStatus === 2) {
      res.status(200).json({
        msg: "Viaje aceptado correctamente",
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};

export const postTravelBordo = async (req: Request, res: Response) => {
  try {
    const { id_viaje } = req.body;
    const query = await pool.query(
      `CALL BORDO_VIAJE(
        '${id_viaje}'
      );`
    );
    console.log(query)
    if (query.serverStatus === 2) {
      res.status(200).json({
        msg: "Viaje a bordo",
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};




export const postTravelFinish = async (req: Request, res: Response) => {
  try {
    const { id_viaje } = req.body;

    const query = await pool.query(
      `CALL TERMINAR_VIAJE(
        '${id_viaje}'
     );`
    );

    if (query.serverStatus === 2) {
      res.status(200).json({
        msg: "Viaje finalizado correctamente",
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};

export const postCancelTravel = async (req: Request, res: Response) => {
  try {
    const { id_viaje } = req.body;

    const query = await pool.query(
      `CALL CANCELAR_VIAJE(
        '${id_viaje}'
     );`
    );

    if (query.serverStatus === 2) {
      res.status(200).json({
        msg: "Viaje finalizado correctamente",
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};


export const getTravels = async (req: Request, res: Response) => {
  try {
    const query = await pool.query(`SELECT * FROM TABLA_VIAJE`);
    if (query.length > 0) {
      res.status(200).json({
        viajes: query,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};


export const getTravelsweb = async (req: Request, res: Response) => {
  try {
    const query = await pool.query(`SELECT SW.nombre as 'pasajero',CONCAT(PE.nombres, ' ', PE.apellidos) as 
    'conductor', VE.modelo as 'num_unidad', PE.telefono,SW.direccion_origen, SW.referencia,
     VW.fechayhora_inicio,VW.estado FROM viajeweb VW INNER JOIN solicitudweb SW ON VW.id_solicitudweb 
     = SW.id_solicitudweb INNER JOIN conductor CO ON CO.id_conductor = VW.id_conductor INNER JOIN 
     persona PE ON CO.id_persona = PE.id_persona INNER JOIN vehiculo VE ON VE.id_vehiculo = CO.id_vehiculo
      ORDER BY(VW.fechayhora_inicio) DESC;`);
    if (query.length > 0) {
      res.status(200).json({
        viajesweb: query,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};


export const getDriverTravel = async (req: Request, res: Response) => {
  try {
    const { id_solicitud } = req.body;
    const query = await pool.query(
      `CALL INFO_DRIVER_TRAVEL(
        '${id_solicitud}'
      );`
    );
      res.status(200).json({
        viaje: query[0],
      });
    
  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};


export const getStateTravel = async (req: Request, res: Response) => {
  try {
    const {id_travel} = req.params;
    const query = await pool.query(
      `SELECT estado FROM viaje WHERE id_viaje ='${id_travel}'`
    );
      res.status(200).json({
        estado: query[0].estado,
      });
    
  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};


export const sendOpinion = async (req: Request, res: Response) => {
  try {
    const {id_viaje,id_pasajero,valoracion,descripcion} = req.body;
    const query = await pool.query(
      `INSERT INTO opinion(id_viaje,id_pasajero,valoracion,comentario) 
      VALUES('${id_viaje}','${id_pasajero}','${valoracion}','${descripcion}')`
    );
      if(query.serverStatus === 2){
        res.status(200).json({
          message: "Opinion enviada correctamente",
        });
      }
  
    
  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};


export const aceptTravelWeb = async (req: Request, res: Response) => {
  try {
    const {id_requestweb,id_conductor} = req.body;
    const stateRequestweb = await pool.query(
      `SELECT  SW.estado from solicitudweb SW where SW.id_solicitudweb ='${id_requestweb}'`
    );
    var estado = stateRequestweb[0].estado;

    if(estado == 'pendiente'){
      const aceptRequestweb =  await pool.query(
        `UPDATE solicitudweb SW SET SW.estado='aceptado' WHERE SW.id_solicitudweb ='${id_requestweb}'`
      );
      const createTravelweb = await pool.query(
        `INSERT INTO viajeweb(id_solicitudweb ,id_conductor) 
        VALUES('${id_requestweb}','${id_conductor}');`
      );
        if(createTravelweb.serverStatus === 2){
          res.status(200).json({
            message: "Viaje web aceptado correctamente",
          });
        }
    }else{
       res.status(500).json({
          message: "Lo sentimos, La solicitud web ya aceptada",
      });
    }
    
  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador de la db.",
    });
  }
};


export const sendTravelWebTerminated= async (req: Request, res: Response) => {
  try {
    const {id_solicitudweb} = req.body;
    const query = await pool.query(
      `UPDATE viajeweb VW SET VW.estado= 'terminado' WHERE VW.id_solicitudweb ='${id_solicitudweb}'`
    );
    console.log(query)
      if(query.serverStatus === 2){
        res.status(200).json({
          message: "Viaje finalizado correctamente.",
        });
      }
  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador de la db.",
    });
  }
};