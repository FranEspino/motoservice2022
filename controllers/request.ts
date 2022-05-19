import { Request, Response } from "express";

const pool = require("../mysql/database");


export const postRequest = async (req: Request, res: Response) => {
  try {
    const {
        latitud_origen,
        longitud_origen,
        latitud_destino,
        longitud_destino,
        direccion_actual,
        direccion_destino,
        referencia,
        id_pasajero,
        precio_oferta,
      } = req.body;
    const query = await pool.query(
        `CALL NUEVA_SOLICITUD(
          '${latitud_origen}',
          '${longitud_origen}',
          '${latitud_destino}',
          '${longitud_destino}',
          '${direccion_actual}',
          '${direccion_destino}',
          '${referencia}',
          '${id_pasajero}',
          '${precio_oferta}'
        );`
    )
 if (query[0]) {
      res.status(200).json({
        id_solicitud :query[0],

      });
    } else {
      res.status(400).json({
        message: "Error al enviar la solicitud, verifique bien sus datos.",
      });
    }

  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};

export const getRequest = async (req: Request, res: Response) => {
  try {
    const query = await pool.query(`SELECT * FROM TABLA_SOLICITUDES`);
    if (query.length > 0) {
      res.status(200).json({
        solicitudes: query,
      });
    }else{
      res.status(400).json({
        message: 'No hay solicitudes',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};



export const getRequestPending = async (req: Request, res: Response) => {
  try {
    
    const query = await pool.query(`SELECT CONCAT(PE.nombres,' ', PE.apellidos) AS 'Pasajero' , S.id_solicitud, PE.telefono,PA.token, PE.foto, L.direccion_actual, L.direccion_destino, L.referencia, L.latitud_origen,L.longitud_origen, L.latitud_destino, L.longitud_destino, S.fechayhora, S.estado, S.precio_oferta FROM solicitud S INNER JOIN localizacion L ON L.id_localizacion = S.id_localizacion INNER JOIN pasajero PA ON S.id_pasajero = PA.id_pasajero INNER JOIN persona PE ON PA.id_persona = PE.id_persona WHERE S.estado='pendiente' ORDER BY (S.fechayhora) DESC;`);
    if (query.length > 0) {
      res.status(200).json({
        solicitudes: query,
      });
    }else{
      res.status(400).json({
        message: 'No hay solicitudes',
      });
    }
    
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};



export const getStateRequest = async (req: Request, res: Response) => {
  try {
    const {id_solicitud} = req.params;

    const query = await pool.query(`SELECT S.estado,LO.direccion_actual,LO.direccion_destino ,CONCAT(PE.nombres,' ',PE.apellidos ) as 'nombre', PE.telefono, PE.foto  FROM solicitud S 
    INNER JOIN pasajero PA ON S.id_pasajero = PA.id_pasajero 
    INNER JOIN  persona PE ON PA.id_persona = PE.id_persona
    INNER JOIN localizacion LO ON S.id_localizacion = LO.id_localizacion
    WHERE id_solicitud='${id_solicitud}';`);
    if (query.length > 0) {
      res.status(200).json({
        ... query[0]
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};


export const getSumRequest= async (req: Request, res: Response) => {
  try {
    
    const query = await pool.query(`SELECT * FROM SOLICITUDES_PENDIENTES_SUM`);
    if (query.length > 0) {
      res.status(200).json({
        total_pendientes: query[0].total_pendientes,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};


export const postCancelRequest= async (req: Request, res: Response) => {
  try {
    
    const query = await pool.query(`UPDATE solicitud SET estado = 'cancelada' WHERE id_solicitud = '${req.body.id_solicitud}'`);
    if (query.affectedRows > 0) {
      res.status(200).json({
        message: 'Solicitud cancelada'
      });
    }
    console.log(query)
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};

export const postRequestWeb = async (req: Request, res: Response) => {
  try {
    const {
        nombre ,
        apellido ,
        dni ,
        telefono ,
        direccion_origen ,
        direccion_destino ,
        referencia
        
      } = req.body;
      console.log(req.body)
    const query = await pool.query(
        `CALL NUEVA_SOLICITUDWEB(
          '${nombre }',
          '${apellido }',
          '${dni }',
          '${telefono}',
          '${direccion_origen}',
          '${direccion_destino}',
          '${referencia}'
        );`
    )
    console.log(query)
    if (query[0]) {
        res.status(200).json({
          ...query[0][0],
        });
    } else {
      res.status(400).json({
        message: "Error al enviar la solicitud, verifique bien sus datos.",
      });
    }

  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador de la db.",
    });
  }
};


export const getRequestWeb = async (req: Request, res: Response) => {
  try {
    const query = await pool.query(
        `SELECT SW.nombre, SW.telefono, SW.direccion_origen, SW.direccion_destino, SW.estado, SW.referencia, SW.fechayhora FROM solicitudweb SW ORDER BY(SW.fechayhora) DESC;`
    )
    if(query.length > 0) {
      res.status(200).json({
        solicitudesweb: query
      })
    }else{
      res.status(200).json({
        message: "No hay solicitudes web actualmente."
      })
    }

  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};


export const getRequestWebPending = async (req: Request, res: Response) => {
  try {
    const query = await pool.query(
        `SELECT SW.id_solicitudweb, SW.nombre, SW.telefono, SW.direccion_origen, SW.direccion_destino, SW.estado, SW.referencia, SW.fechayhora FROM solicitudweb SW WHERE SW.estado="pendiente" ORDER BY(SW.fechayhora) DESC;`
    )
    if(query.length > 0) {
      res.status(200).json({
        solicitudesweb: query
      })
    }else{
      res.status(200).json({
        message: "No hay solicitudes pendientes."
      })
    }

  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};


export const getRequestWebId= async (req: Request, res: Response) => {
  try {
    const {id_requestweb} = req.params;
    const query = await pool.query(
        `SELECT SW.nombre, SW.telefono, SW.direccion_origen, SW.direccion_destino, SW.estado, SW.referencia, SW.fechayhora FROM solicitudweb SW  WHERE SW.id_solicitudweb = '${id_requestweb}'`
    )

    if(query[0]) {
      res.status(200).json({
        ...query[0]
      })
    }else{
      res.status(400).json({
        message: 'Error al encontrar la solicitud.'
      })
    }

  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};

export const getRequestWebAcept= async (req: Request, res: Response) => {
  try {
    const {id_solicitudweb} = req.body;
    const query = await pool.query(
        `UPDATE solicitudweb SET estado = 'aceptada' WHERE id_solicitudweb = '${id_solicitudweb}'`
    )
    if(query.affectedRows > 0) {
      res.status(200).json({
        message: 'Solicitud aceptada correctamente.'
      })
    }else{
      res.status(400).json({
        message: 'Error al aceptar la solicitud.'
      })
    }

  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};



export const getRequestWebCancel= async (req: Request, res: Response) => {
  try {
    const {id_solicitudweb} = req.body;
    const query = await pool.query(
        `UPDATE solicitudweb SET estado = 'cancelado' WHERE id_solicitudweb = '${id_solicitudweb}'`
    )
    if(query.affectedRows > 0) {
      res.status(200).json({
        message: 'Solicitud cancelada correctamente.'
      })
    }else{
      res.status(400).json({
        message: 'Error al cancelar la solicitud.'
      })
    }

  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};


export const getRequestWebTerminado= async (req: Request, res: Response) => {
  try {
    const {id_solicitudweb} = req.body;
    const query = await pool.query(
        `UPDATE solicitudweb SET estado = 'terminado' WHERE id_solicitudweb = '${id_solicitudweb}'`
    )
    if(query.affectedRows > 0) {
      res.status(200).json({
        message: 'Solicitud terminada correctamente.'
      })
    }else{
      res.status(400).json({
        message: 'Error al terminada la solicitud.'
      })
    }

  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};


export const getSumRequestApp = async (req: Request, res: Response) => {
  try {
    const query = await pool.query(`SELECT COUNT(*) as numsolicitudesapp from solicitud`);
    if (query.length > 0) {
      res.status(200).json({
        solicitudesapp: query[0].numsolicitudesapp
      });
    }else{
      res.status(400).json({
        message: 'No hay solicitudes',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};


export const getSumTodayRequestApp = async (req: Request, res: Response) => {
  try {
    const query = await pool.query(`select count(*) as requestAppToday from solicitud S WHERE
     S.fechayhora BETWEEN CURDATE() and CURDATE() + INTERVAL 7 DAY;`);
    if (query.length > 0) {
      res.status(200).json({
        solicitudesapphoy: query[0].requestAppToday
      });
    }else{
      res.status(400).json({
        message: 'No hay solicitudes',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};


export const getRequestAppPag = async (req: Request, res: Response) => {
  const {numero_pagina} = req.params;

  try {
    const query = await pool.query(`CALL TABLA_SOLICITUDES_PAG ('${numero_pagina}')`);
    if (query.length > 0) {
      res.status(200).json({
          solicitudes: query[0]
      });
    }else{
      res.status(400).json({
        message: 'No hay solicitudes',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};



export const getSumRequestWeb = async (req: Request, res: Response) => {
  try {
    const query = await pool.query(`SELECT COUNT(*) as numsolicitudesweb from solicitudweb`);
    if (query.length > 0) {
      res.status(200).json({
        solicitudesweb: query[0].numsolicitudesweb
      });
    }else{
      res.status(400).json({
        message: 'No hay solicitudes',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};



export const getSumTodayRequestWeb = async (req: Request, res: Response) => {
  try {
    const query = await pool.query(`select count(*) as requestWebToday from solicitudweb S WHERE
     S.fechayhora BETWEEN CURDATE() and CURDATE() + INTERVAL 7 DAY;`);
    if (query.length > 0) {
      res.status(200).json({
        solicitudeswebhoy: query[0].requestWebToday
      });
    }else{
      res.status(400).json({
        message: 'No hay solicitudes',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};



export const getRequestWebPag = async (req: Request, res: Response) => {
  const {numero_pagina} = req.params;

  try {
    const query = await pool.query(`CALL TABLA_SOLICITUDES_WEB ('${numero_pagina}')`);
    if (query.length > 0) {
      res.status(200).json({
          solicitudes: query[0]
      });
    }else{
      res.status(400).json({
        message: 'No hay solicitudes',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};
