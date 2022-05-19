import { Request, Response } from "express";
const pool = require("../mysql/database");
const path = require("path");
const fs = require("fs");
export const postDriver = async (req: Request, res: Response) => {
  try {
    const {
      nombres,
      apellidos,
      nmr_documento,
      telefono,
      direccion,
      edad,
      email,
      sexo,
      fnacimiento,
      avatar,
      clave,
      placa,
      marca,
      modelo,
      color,
      anio,
    } = req.body;

    const query = await pool.query(
      `CALL CREAR_CONDUCTOR(
        '${nombres}',
        '${apellidos}',
        '${nmr_documento}',
        '${telefono}',
        '${direccion}',
        '${edad}',
        '${email}',
        '${sexo}',
        '${fnacimiento.split("/").reverse().join("/")}',
        '${avatar}',
        '${clave}',
        '${placa}',
        '${marca}',
        '${modelo}',
        '${color}',
        '${anio}'
      );`
    );
    if (query.serverStatus === 16418) {
      res.status(200).json({
        message: "Conductor creado correctamente",
        data: query,
      });
    } else {
      let directory = path.join(
        __dirname,
        "../public/images/" + req.body.avatar
      );
      fs.unlinkSync(directory);
      res.status(400).json({
        message: "Error al crear conductor, verifique bien sus datos.",
      });
    }
  } catch (error) {
    let directory = path.join(__dirname, "../public/images/" + req.body.avatar);
    fs.unlinkSync(directory);
    res.status(500).json({
      message:
        "Posiblemente el dni ya existe, verifique sus datos o comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};

export const updateDriverWithPhoto = async (req: Request, res: Response) => {
  try {
    const {
      id_persona,
      nombres,
      apellidos,
      dni,
      edad,
      correo,
      direccion,
      telefono,
      sexo,
      fnacimiento,
      avatar,
    } = req.body;
    const person = await pool.query(
      `select * from persona where id_persona='${id_persona}'`
    );

    if (avatar == "" && avatar == null && avatar == undefined) {
      const query = await pool.query(
        `UPDATE persona P SET nombres = '${nombres}',apellidos = '${apellidos}',
        nmr_documento = '${dni}',edad = '${edad}',email = '${correo}',direccion = '${direccion}',
        telefono = '${telefono}',sexo = '${sexo}',fnacimiento = '${fnacimiento
          .split("/")
          .reverse()
          .join("/")}'
        WHERE id_persona = '${id_persona}';`
      );
      res.status(200).json({
        message: "Datos actualizados correctamente",
        data: query,
      });
    } else {
      if (
        person[0].foto !== "" &&
        person[0].foto !== null &&
        person[0].foto !== undefined
      ) {
        if (
          fs.existsSync(
            path.join(__dirname, "../public/images/" + person[0].foto)
          )
        ) {
          let directory = path.join(
            __dirname,
            "../public/images/" + person[0].foto
          );
          fs.unlinkSync(directory);
        }
      }

      const query = await pool.query(
        `UPDATE persona SET nombres = '${nombres}',apellidos = '${apellidos}',
        nmr_documento = '${dni}',edad = '${edad}',email = '${correo}',direccion = '${direccion}',
        telefono = '${telefono}',sexo = '${sexo}',fnacimiento = '${fnacimiento
          .split("/")
          .reverse()
          .join("/")}', foto = '${avatar}'
        WHERE id_persona = '${id_persona}';`
      );

      res.status(200).json({
        message: "Datos actualizados correctamente",
        data: query,
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};

export const updateDriverNotPhoto = async (req: Request, res: Response) => {
  var id_persona;
  try {
    const {
      id_conductor,
      nombres,
      apellidos,
      dni,
      edad,
      correo,
      direccion,
      telefono,
      sexo,
      fnacimiento,
    } = req.body;
    const query1 = await pool.query(
      `SELECT CO.id_persona from conductor CO where CO.id_conductor = '${id_conductor}'`
    );
    if (query1.length > 0) {
      const query = await pool.query(
        `UPDATE persona P SET nombres = '${nombres}',apellidos = '${apellidos}',
          nmr_documento = '${dni}',edad = '${edad}',email = '${correo}',direccion = '${direccion}',
          telefono = '${telefono}',sexo = '${sexo}',fnacimiento = '${fnacimiento
          .split("/")
          .reverse()
          .join("/")}'
          WHERE id_persona = '${query1[0].id_persona}';`
      );
      res.status(200).json({
        message: "Datos actualizados correctamente",
        data: query,
      });
    } else {
      res.status(200).json({
        message: "Conductor no encontrado",
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};

export const getDriver = async (req: Request, res: Response) => {
  try {
    const query = await pool.query(`SELECT * FROM TABLA_CONDUCTORES`);
    if (query.length > 0) {
      res.status(200).json({
        conductores: query,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};

export const getDriverID = async (req: Request, res: Response) => {
  try {
    const { id_persona } = req.params;
    const query = await pool.query(`CALL INFO_CONDUCTOR('${id_persona}');`);
    if (query.length > 0) {
      res.status(200).json({
        conductor: query[0],
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};

export const getCurrentDriver = async (req: Request, res: Response) => {
  try {
    const { id_conductor } = req.params;
    const query = await pool.query(
      `CALL LOCATION_DRIVER('${parseInt(id_conductor)}');`
    );
    if ((query.serverStatus = 2)) {
      res.status(200).json({
        location: query[0],
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};

export const postUpdateDriver = async (req: Request, res: Response) => {
  try {
    const { id_conductor, latitud, longitud } = req.body;
    const query = await pool.query(
      `CALL UPDATE_LOCATION_DRIVER(
        '${id_conductor}',
        '${latitud}',
        '${longitud}'
      );`
    );
    if ((query.affectedRows = 1)) {
      res.status(200).json({
        message: "Localizacion actualizada.",
      });
    } else {
      res.status(400).json({
        message: "Error al crear conductor, verifique bien sus datos.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};

export const getCurrentLocations = async (req: Request, res: Response) => {
  try {
    const query = await pool.query(`SELECT * FROM CURRENT_DRIVERS`);
    if (query.length > 0) {
      res.status(200).json({
        drivers: query,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};

export const setStateActive = async (req: Request, res: Response) => {
  const { id_conductor } = req.body;
  try {
    const query = await pool.query(
      `UPDATE conductor SET estado = 'activo' WHERE conductor.id_conductor= '${id_conductor}';`
    );
    if (query.affectedRows > 0) {
      res.status(200).json({
        message: "Modo de estado activo, listo para recibir notificaciones.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};

export const setStateInactive = async (req: Request, res: Response) => {
  const { id_conductor } = req.body;
  try {
    const query = await pool.query(
      `UPDATE conductor SET estado = 'inactivo' WHERE conductor.id_conductor= '${id_conductor}';`
    );
    if (query.affectedRows > 0) {
      res.status(200).json({
        message: "Modo de estado inactivo, no te llegaran notificaciones.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};

export const blockDriver = async (req: Request, res: Response) => {
  try {
    const { id_persona } = req.body;
    const query = await pool.query(
      `UPDATE conductor SET estado = 'bloqueado' WHERE conductor.id_persona= '${id_persona}';`
    );
    if ((query.affectedRows = 1)) {
      res.status(200).json({
        message: "Conductor bloqueado.",
      });
    } else {
      res.status(400).json({
        message: "Error al bloquear conductor, verifique bien sus datos.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};

export const activeDriverWeb = async (req: Request, res: Response) => {
  try {
    const { id_persona } = req.body;
    const query = await pool.query(
      `UPDATE conductor SET estado = 'activo' WHERE conductor.id_persona= '${id_persona}';`
    );
    if ((query.affectedRows = 1)) {
      res.status(200).json({
        message: "Conductor Activado.",
      });
    } else {
      res.status(400).json({
        message: "Error al activar conductor, verifique bien sus datos.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};

export const searchDriverPhone = async (req: Request, res: Response) => {
  try {
    const { telefono } = req.body;
    const query = await pool.query(`
    SELECT PE.id_persona, PE.nombres, PE.apellidos, PE.nmr_documento,
    PE.telefono, VE.placa, VE.marca, VE.color, VE.modelo, CO.estado
    from conductor CO INNER JOIN persona PE 
    ON CO.id_persona = PE.id_persona
    INNER JOIN vehiculo VE ON CO.id_vehiculo = VE.id_vehiculo
    WHERE PE.telefono ='${telefono}'`);
    if (query.length > 0) {
      res.status(200).json({
        ...query[0],
      });
    } else {
      res.status(404).json({
        message: "Lo sentimos, No se encontraron resultados.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};

export const getVehiculeDriver = async (req: Request, res: Response) => {
  try {
    const { id_conductor } = req.params;
    const query = await pool.query(`
    SELECT VE.id_vehiculo, VE.placa, VE.marca, VE.modelo, VE.color, VE.anio
    FROM vehiculo VE INNER JOIN conductor CO ON VE.id_vehiculo = CO.id_conductor
    WHERE CO.id_conductor ='${id_conductor}'`);
    if (query.length > 0) {
      res.status(200).json({
        vehiculo: query[0],
      });
    } else {
      res.status(404).json({
        message: "Lo sentimos, No se encontraron resultados.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};

export const updateVehiculeDriver = async (req: Request, res: Response) => {
  try {
    const { id_vehiculo, placa, marca, modelo, color, anio } = req.body;
    const query = await pool.query(`
    UPDATE vehiculo VE SET VE.placa = '${placa}' , VE.marca = '${marca}', VE.modelo = '${modelo}',
    VE.color = '${color}', VE.anio =  '${anio}' WHERE VE.id_vehiculo ='${id_vehiculo}'`);
    if (query.affectedRows > 0) {
      res.status(200).json({
        message: "Vehiculo actualizado."
      });
    } else {
      res.status(404).json({
        message: "Lo sentimos, no se pudo actualizar el vehiculo.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};
