import { Request, Response } from "express";
const pool = require("../mysql/database");
const path = require("path");
const fs = require("fs");

export const updateInfo = async (req: Request, res: Response) => {

  try {
    const { id_persona, nombres, apellidos, telefono, email, avatar } =
      req.body;

    const person = await pool.query(
      `select * from persona where id_persona='${id_persona}'`
    );

    if (avatar == "" &&
    avatar== null &&
    avatar== undefined) {
      const query = await pool.query(
        `UPDATE persona SET nombres = '${nombres}',apellidos = '${apellidos}', telefono = '${telefono}', email = '${email}'  WHERE id_persona = '${id_persona}';`
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
        `UPDATE persona SET nombres = '${nombres}',apellidos = '${apellidos}', telefono = '${telefono}', email = '${email}', foto= '${avatar}' WHERE id_persona = '${id_persona}';`
      );

      res.status(200).json({
        foto: avatar,
        nombres: nombres,
        apellidos: apellidos,
        telefono: telefono,
        email: email,
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal, hable con el administrador.",
    });
  }
};



export const updateInfoNotPhoto = async (req: Request, res: Response) => {
  try { 
    const { id_persona, nombres, apellidos, telefono, email } =  req.body;
      const updateuser = await pool.query(`UPDATE persona SET nombres = '${nombres}',apellidos = '${apellidos}', telefono = '${telefono}', email = '${email}' WHERE id_persona = '${id_persona}';`);
      if(updateuser.affectedRows > 0){
        res.status(200).json({
          newinfo: {nombres,  apellidos, telefono, email },
        });
      }else{
        res.status(500).json({
          msg: "Algo salió mal, hable con el administrador.",
        });
      }

  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};





export const postPassengerApp = async (req: Request, res: Response) => {
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

    console.log(req.body);
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


export const postPassengerAppNotPhoto = async (req: Request, res: Response) => {
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
      avatar = "emmptyimage",
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
      res.status(400).json({
        message: "Error al crear pasajero, verifique bien sus datos.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message:
        "Posiblemente el dni ya existe, verifique sus datos o comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};


export const stateUser = async (req: Request, res: Response) => {
  try {
    const {type, id_rol} = req.body;
    console.log(req.body);
    if(type == 'pasajero') {
      const state = await pool.query(`
      SELECT estado from pasajero where id_pasajero ='${id_rol}';`);
      res.status(200).json({
        estado: state[0].estado,
      });
    }

    if(type == 'conductor') {
      const state = await pool.query(`
      SELECT estado from conductor where id_conductor='${id_rol}';`);
      res.status(200).json({
        estado: state[0].estado,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};



export const versionApp = async (req: Request, res: Response) => {
  try { 
      const versionapp = await pool.query(`SELECT version from versionapp`);
      res.status(200).json({
        version: versionapp[0].version,
      });
   
  } catch (error) {
    res.status(500).json({
      message: "Error en la solicitud, comuniquese con el equipo de soporte.",
      error: error,
    });
  }
};

