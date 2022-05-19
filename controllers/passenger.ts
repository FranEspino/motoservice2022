import { Request, Response } from "express";
const pool = require("../mysql/database");
const path = require("path");
const fs = require("fs");
export const postPassenger = async (req: Request, res: Response) => {
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
      clave,
      avatar,
    } = req.body;

    const query = await pool.query(
      `CALL CREAR_PASAJERO(
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
        '${clave}'
      );`
    );
    if (query.serverStatus === 16418) {
      res.status(200).json({
        message: "Pasajero creado correctamente",
        data: query,
      });
    } else {
      let directory = path.join(
        __dirname,
        "../public/images/" + req.body.avatar
      );
      fs.unlinkSync(directory);
      res.status(400).json({
        message: "Error al crear pasajero, verifique bien sus datos.",
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

export const getPassanger = async (req: Request, res: Response) => {
  try {
    const query = await pool.query(`SELECT * FROM TABLA_PASAJEROS`);
    if (query.length > 0) {
      res.status(200).json({
        pasajeros: query,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};



export const getPassengerID = async (req: Request, res: Response) => {
  try {
    const {id_persona} = req.params;

    const query = await pool.query(`CALL INFO_PASAJERO('${id_persona}');`);
    if (query.length > 0) {
      res.status(200).json({
        pasajero: query[0],
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};


export const searchPassengerPhone = async (req: Request, res: Response) => {
  try {
    const {telefono} = req.body;
    const query = await pool.query(`SELECT P.nombres,P.apellidos, P.nmr_documento, P.telefono, P.direccion, P.fnacimiento, P.id_persona, P.estado  FROM persona P WHERE P.telefono = '${telefono}'`);
    if (query.length > 0) {
      res.status(200).json({
      ...query[0],
      });
    }else{
      res.status(404).json({
        message: 'No se encontraron resultados',
        });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};


export const blockPassenger = async (req: Request, res: Response) => {
  try {
    const { id_persona} = req.body;
    const query = await pool.query( `UPDATE pasajero SET estado = 'bloqueado' WHERE pasajero.id_persona= '${id_persona}';`);
    if (query.affectedRows = 1) {
      res.status(200).json({
        message: "Pasajero bloqueado.",
      });
    }else{
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



export const activePassengerWev = async (req: Request, res: Response) => {
  try {
    const { id_persona} = req.body;
    const query = await pool.query( `UPDATE pasajero SET estado = 'activo' WHERE pasajero.id_persona= '${id_persona}';`);
    if (query.affectedRows = 1) {
      res.status(200).json({
        message: "Pasajero Activado.",
      });
    }else{
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