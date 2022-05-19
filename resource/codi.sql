DROP DATABASE IF EXISTS codi;
CREATE DATABASE codi;
USE codi;
CREATE TABLE rol (
  cod_rol INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  nombre_rol VARCHAR(60) 
);

CREATE TABLE cuenta (
  id_cuenta INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  cod_rol INT NOT NULL,
  usuario VARCHAR (50) NOT NULL,
  clave VARCHAR(50) NOT NULL,
  token TEXT DEFAULT NULL,
  estado VARCHAR(50) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT cuenta_rol FOREIGN KEY (cod_rol) REFERENCES rol(cod_rol) 
);

CREATE TABLE persona (
  id_persona INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  nombres VARCHAR(70) NOT NULL,
  apellidos VARCHAR(70) NOT NULL,
  nmr_documento  VARCHAR(30) NOT NULL,
  telefono VARCHAR(50) NOT NULL,
  direccion VARCHAR(70) ,
  edad INT,
  email VARCHAR(50),
  sexo VARCHAR(40),
  fnacimiento DATE,
  foto VARCHAR(200), 
  estado VARCHAR(50) DEFAULT 'registrado'
);

CREATE TABLE pasajero(
  id_pasajero INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  id_persona INT NOT NULL,
  id_cuenta INT NOT NULL,
  token TEXT,
  estado VARCHAR(45) DEFAULT 'activo',
  CONSTRAINT pasajero_persona FOREIGN KEY (id_persona) REFERENCES persona (id_persona),
  CONSTRAINT pasajero_cuenta FOREIGN KEY (id_cuenta) REFERENCES cuenta(id_cuenta) 
);


CREATE TABLE vehiculo(
  id_vehiculo INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  placa VARCHAR(45) NOT NULL,
  marca VARCHAR(45),
  modelo VARCHAR(45),
  color VARCHAR(45),
  anio INT
);


CREATE TABLE conductor(
  id_conductor INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  id_persona INT NOT NULL,
  id_vehiculo INT NOT NULL,
  id_cuenta INT NOT NULL,
  token TEXT,
  latitud DECIMAL(15,9) DEFAULT '0.000000000',
  longitud DECIMAL(15,9) DEFAULT '0.000000000',
  estado VARCHAR(45) DEFAULT 'inactivo',
  CONSTRAINT conductor_persona FOREIGN KEY (id_persona) REFERENCES persona (id_persona) ,
  CONSTRAINT conductor_vehiculo FOREIGN KEY (id_vehiculo) REFERENCES vehiculo(id_vehiculo) ,
  CONSTRAINT conductor_cuenta FOREIGN KEY (id_cuenta) REFERENCES cuenta(id_cuenta) 
);

CREATE TABLE opinion(
  id_opinion INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  id_viaje INT NOT NULL,
  id_pasajero INT NOT NULL,
  valoracion FLOAT NOT NULL,
  comentario TEXT,
  fechayhora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT opinion_pasajero FOREIGN KEY (id_pasajero) REFERENCES pasajero (id_pasajero) ,
  CONSTRAINT opinion_viaje FOREIGN KEY (id_viaje) REFERENCES viaje (id_viaje) 
);


CREATE TABLE localizacion(
  id_localizacion INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  latitud_origen DECIMAL(15,9) DEFAULT '0.000000000',
  longitud_origen DECIMAL(15,9) DEFAULT '0.000000000',
  latitud_destino DECIMAL(15,9) DEFAULT '0.000000000',
  longitud_destino DECIMAL(15,9) DEFAULT '0.000000000',
  direccion_actual VARCHAR(70),
  direccion_destino VARCHAR(70),
  referencia VARCHAR(70) 
);


CREATE TABLE solicitud(
  id_solicitud INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  id_pasajero INT NOT NULL,
  id_localizacion INT NOT NULL,
  precio_oferta FLOAT,
  fechayhora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(50) DEFAULT 'espera', 
  CONSTRAINT solicitud_pasajero FOREIGN KEY (id_pasajero) REFERENCES pasajero (id_pasajero),
  CONSTRAINT solicitud_localizacion FOREIGN KEY (id_localizacion) REFERENCES localizacion (id_localizacion) 
);


CREATE TABLE viaje(
  id_viaje INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  id_solicitud INT NOT NULL,
  id_conductor INT NOT NULL ,
  precio_final FLOAT,
  fechayhora_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fechayhora_fin DATETIME,
  estado VARCHAR(50) DEFAULT 'pendiente',
  CONSTRAINT viaje_solicitud FOREIGN KEY (id_solicitud) REFERENCES solicitud (id_solicitud),
  CONSTRAINT viaje_conductor FOREIGN KEY (id_conductor) REFERENCES conductor (id_conductor)
);


CREATE TABLE caja(
  id_caja INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  id_solicitud INT NOT NULL, 
  importe FLOAT,
  comision FLOAT,
  fechayhora  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT caja_solicitud FOREIGN KEY (id_solicitud) REFERENCES solicitud (id_solicitud)
);

CREATE TABLE solicitudweb (
    id_solicitudweb INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    id_conductor INT NOT NULL,
   	nombre VARCHAR(60),
    apellido VARCHAR(60),
    dni VARCHAR(30),
    estado VARCHAR(30),
    telefono VARCHAR(60),
    direccion_origen VARCHAR(80),   
    direccion_destino VARCHAR(80),    
    referencia VARCHAR(80),    
    fechayhora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE viajeweb(
    id_viajeweb  INT  NOT NULL  AUTO_INCREMENT PRIMARY KEY ,
    id_solicitudweb INT NOT NULL,
    id_conductor INT NOT NULL,
    precio_final FLOAT,
    estado VARCHAR(100) DEFAULT 'aceptado',
    fechayhora_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_viajeswebsol FOREIGN KEY (id_solicitudweb) REFERENCES solicitudweb (id_solicitudweb),
    CONSTRAINT fk_viajeswebconductor FOREIGN KEY (id_conductor) REFERENCES conductor (id_conductor)
);


/*----- NUEVA SOLICITUD  WEB-----*/

INSERT INTO rol  VALUES (1000, 'pasajero');
INSERT INTO rol  VALUES (2000, 'conductor');


drop procedure if exists NUEVA_SOLICITUDWEB;
delimiter //
CREATE PROCEDURE  NUEVA_SOLICITUDWEB
(
   in nombre VARCHAR(60),
   in apellido VARCHAR(60),
   in  dni VARCHAR(30),
   in  telefono VARCHAR(60),
   in  direccion_origen VARCHAR(80),   
   in  direccion_destino VARCHAR(80),    
   in referencia VARCHAR(80)
)

BEGIN
DECLARE id_solicitudweb INT;
      START TRANSACTION;
        insert into solicitudweb(nombre,apellido,dni,estado,telefono,direccion_origen,direccion_destino,referencia) values( nombre,apellido,dni,'pendiente',telefono,direccion_origen,direccion_destino,referencia);
          set id_solicitudweb = last_insert_id();
        if(id_solicitudweb !='NULL') then 
          commit; 
           SELECT id_solicitudweb;
        else 
          rollback;
          signal sqlstate '45000' set message_text = 'Error al crear la solicitud, revise los datos.';
        end if;
END;
//



/*----- CREAR PASAJERO -----*/

drop procedure if exists CREAR_PASAJERO;
delimiter //
CREATE PROCEDURE  CREAR_PASAJERO
(in nombres varchar(70), in apellido varchar(70),in nmr_documento varchar(30),
in telefono char(9), in direccion varchar(70),in edad int, in email varchar(50),
in sexo varchar(40),fnacimiento date, in foto varchar(200), clave varchar(50))
BEGIN
DECLARE id_persona, aux, id_pasajero,id_cuenta INT;
	set aux = (select persona.id_persona 
               from persona 
               where persona.nmr_documento = nmr_documento);
	if(aux<=>NULL) then
      START TRANSACTION;
        insert into persona values(NULL,nombres,apellido,nmr_documento,telefono,direccion,edad,email,sexo,fnacimiento,foto, 'registrado');
          set id_persona = last_insert_id();
        insert into cuenta(cod_rol,usuario,clave) values(1000,nmr_documento,clave);
          set id_cuenta = last_insert_id();
        insert  pasajero values(NULL,id_persona,id_cuenta,NULL,'disponible');
          set id_pasajero = last_insert_id();
        if(id_pasajero !='NULL') then 
          commit; 
        else 
          rollback;
          signal sqlstate '45000' set message_text = 'No se pudo registrar al pasajero.';
        end if;
  else signal sqlstate '45000' set message_text = 'El dni ya esta registrado.';
	end if;
END;
//

/*----- VER TODOS LOS PASAJEROS -----*/
DROP VIEW IF EXISTS TABLA_PASAJEROS;
 CREATE VIEW TABLA_PASAJEROS AS
    SELECT 
        PE.id_persona,
        PE.nombres,
        PE.apellidos,
        PE.nmr_documento,
        PE.telefono,
        PE.fnacimiento,
        PE.direccion,
        PA.estado,
        PA.id_pasajero      
    FROM
        persona PE INNER JOIN pasajero PA ON PE.id_persona = PA.id_persona
        INNER JOIN cuenta CU ON PA.id_cuenta = CU.id_cuenta ORDER BY(CU.fecha_creacion) DESC;


/*----- VER UN PASAJERO POR ID -----*/
drop procedure if exists INFO_PASAJERO;
delimiter //
CREATE PROCEDURE  INFO_PASAJERO
(in id_persona INT)

BEGIN 
 	SELECT 
        PE.nombres,
        PE.apellidos,
        PE.nmr_documento,
        PE.telefono,
        PE.direccion,
       	PE.edad,
        PE.email,
        PE.sexo,
        PE.fnacimiento,
        PE.foto,
        PA.estado,
        CU.clave
    FROM
        persona PE INNER JOIN pasajero PA ON PE.id_persona = PA.id_persona
        INNER JOIN cuenta CU ON PA.id_cuenta = CU.id_cuenta  WHERE PE.id_persona = id_persona;
END;
//

/*----- CREAR CONDUCTOR -----*/
DROP PROCEDURE IF EXISTS CREAR_CONDUCTOR;
delimiter //
CREATE PROCEDURE  CREAR_CONDUCTOR(in nombres varchar(70),in apellidos varchar(70), in nmr_documento varchar(30), in telefono varchar(9), in direccion varchar(70),
 in edad int,in email varchar(50), in sexo varchar(40), in fnacimiento date, in foto varchar(200), in clave varchar(50),
 in placa varchar(45),in marca varchar(45),in modelo varchar(45),in color varchar(45),in anio int )
 begin 
 
 DECLARE  persona_id,vehiculo_id,cuenta_id,conductor_id int;
    set persona_id = (select id_persona from persona where persona.nmr_documento=nmr_documento);
    if(persona_id<=>NULL) then 
         START TRANSACTION;
		insert into persona(nombres,apellidos,nmr_documento,telefono,direccion,edad,email,sexo,fnacimiento,foto) 
				values(nombres,apellidos,nmr_documento,telefono,direccion,edad,email,sexo,fnacimiento,foto);
		set persona_id = last_insert_id();
        
        insert into cuenta(cod_rol,usuario,clave) values(2000,nmr_documento,clave);
        set cuenta_id = last_insert_id();
        
        insert into vehiculo(placa,marca,modelo,color,anio) values(placa, marca,modelo,color,anio);
        set vehiculo_id = last_insert_id();
        insert into conductor(id_persona,id_vehiculo,id_cuenta) values(persona_id,vehiculo_id,cuenta_id);
        set conductor_id =last_insert_id();
        if(conductor_id !='NULL') then 
          commit; 
        else 
          rollback;
          signal sqlstate '45000' set message_text = 'No se pudo registrar al conductor.';
        end if;
  else signal sqlstate '45000' set message_text = 'El dni ya esta registrado.';
	end if;
END;
//

/*----- VER TODOS LOS CONDUCTORES -----*/
DROP VIEW IF EXISTS TABLA_CONDUCTORES;
 CREATE VIEW TABLA_CONDUCTORES AS
    SELECT 
        PE.id_persona,
        PE.nombres,
        PE.apellidos,
        PE.nmr_documento,
        PE.telefono,
        PE.direccion,
        VE.placa,
        VE.marca,
        VE.color,
        VE.modelo,
        CO.estado      
    FROM
        persona PE INNER JOIN conductor CO ON PE.id_persona = CO.id_persona 
        INNER JOIN vehiculo VE ON CO.id_vehiculo = VE.id_vehiculo INNER JOIN
        cuenta CU ON CO.id_cuenta = CU.id_cuenta ORDER BY(CU.fecha_creacion) DESC;


/*----- VER UN CONDUCTOR POR ID -----*/

drop procedure if exists INFO_CONDUCTOR;
delimiter //
CREATE PROCEDURE  INFO_CONDUCTOR
(in id_conductor INT)

BEGIN 
 	SELECT 
        PE.nombres,
        PE.apellidos,
        PE.nmr_documento,
        PE.telefono,
        PE.direccion,
       	PE.edad,
        PE.email,
        PE.sexo,
        PE.fnacimiento,
        PE.foto,
        CO.estado,
        CU.clave,
        CO.id_conductor
    FROM
        persona PE INNER JOIN conductor CO ON PE.id_persona = CO.id_persona
        INNER JOIN cuenta CU ON CO.id_cuenta = CU.id_cuenta  WHERE PE.id_persona = id_conductor;
END;
//


/*----- VER LA LOCALIZACION DE TODOS LOS CONDUCTORES-----*/

 DROP VIEW IF EXISTS CURRENT_DRIVERS;
 CREATE VIEW CURRENT_DRIVERS AS
    SELECT 
        PE.nombres,
        PE.apellidos,
        PE.telefono,
        PE.foto,
        CO.latitud,
        CO.longitud,
        CO.estado

    FROM
        persona PE INNER JOIN conductor CO ON PE.id_persona = CO.id_persona

        
/*----- VER LA LOCALIZACION DE UN CONDUCTOR-----*/
drop procedure if exists LOCATION_DRIVER;
delimiter //
CREATE PROCEDURE  LOCATION_DRIVER
(in id_conductor INT)

BEGIN 
 	SELECT 
        PE.nombres,
        PE.apellidos,
        PE.telefono,
        CO.latitud,
        CO.longitud

    FROM
        persona PE INNER JOIN conductor CO ON PE.id_persona = CO.id_persona
        WHERE CO.id_conductor = id_conductor;
END;
//

/*----- UPDATE OF LOCATION -----*/
drop procedure if exists UPDATE_LOCATION_DRIVER;
delimiter //
CREATE PROCEDURE  UPDATE_LOCATION_DRIVER
(in id_conductor INT, latitud DECIMAL(15,9), longitud DECIMAL(15,9))

BEGIN 
UPDATE conductor CO SET CO.latitud=latitud, CO.longitud=longitud WHERE CO.id_conductor = id_conductor;

END;
//

/*----- NUEVA SOLICITUD -----*/

drop procedure if exists NUEVA_SOLICITUD;
delimiter //
CREATE PROCEDURE  NUEVA_SOLICITUD
(
   in latitud_origen	decimal(15,9),
   in longitud_origen	decimal(15,9),
   in latitud_destino	decimal(15,9),
   in longitud_destino decimal(15,9),
   in direccion_actual varchar(70),
   in direccion_destino varchar(70),
   in referencia	varchar(70),
   in id_pasajero int,
   in precio_oferta float
)

BEGIN
DECLARE id_localizacion,id_solicitud INT;
      START TRANSACTION;
        insert into localizacion 	values(NULL,latitud_origen,longitud_origen,latitud_destino,longitud_destino,direccion_actual,direccion_destino,referencia);
         set id_localizacion = last_insert_id();
        insert into solicitud(id_solicitud,id_pasajero,id_localizacion,precio_oferta,estado) values(NULL, id_pasajero,id_localizacion,precio_oferta,'pendiente');
          set id_solicitud = last_insert_id();
        if(id_solicitud !='NULL') then 
          commit; 
           SELECT id_solicitud;
        else 
          rollback;
          signal sqlstate '45000' set message_text = 'Error al crear el viaje, revise los datos.';
        end if;
END;
//




/*--- VISTA DE LAS SOLICITUDES ACTUALES (TODOS LOS ESTADOS )--- */

DROP VIEW IF EXISTS TABLA_SOLICITUDES;
    CREATE VIEW TABLA_SOLICITUDES AS
    SELECT CONCAT(PE.nombres,' ', PE.apellidos) AS 'Pasajero' ,
    PE.telefono,L.direccion_actual, L.direccion_destino,
    L.referencia, L.latitud_origen,L.longitud_origen,
    L.latitud_destino, L.longitud_destino, S.fechayhora, 
    S.estado FROM solicitud S INNER JOIN localizacion L 
    ON L.id_localizacion = S.id_localizacion 
    INNER JOIN pasajero PA ON S.id_pasajero = PA.id_pasajero
    INNER JOIN persona PE ON PA.id_persona = PE.id_persona ORDER BY (S.fechayhora) DESC;

    

/*----- TABLA SOLITUD WEB CON PAGINACION -----*/
drop procedure if exists TABLA_SOLICITUDES_PAG;
delimiter //
CREATE PROCEDURE  TABLA_SOLICITUDES_PAG
(
   in page INT
)

BEGIN
SELECT CONCAT(PE.nombres,' ', PE.apellidos) AS 'Pasajero' , 
PE.telefono,L.direccion_actual, L.direccion_destino, L.referencia, 
L.latitud_origen,L.longitud_origen, L.latitud_destino, L.longitud_destino,
S.fechayhora, S.estado FROM solicitud S INNER JOIN localizacion L ON 
L.id_localizacion = S.id_localizacion INNER JOIN pasajero PA ON S.id_pasajero
 = PA.id_pasajero INNER JOIN persona PE ON PA.id_persona = PE.id_persona 
 ORDER BY (S.fechayhora) DESC LIMIT 40 OFFSET page;
END;
//



/*----- TABLA SOLITUD WEB  -----*/
drop procedure if exists TABLA_SOLICITUDES_WEB;
delimiter //
CREATE PROCEDURE  TABLA_SOLICITUDES_WEB
( in page INT)
BEGIN
  SELECT SW.id_solicitudweb, SW.nombre, SW.telefono, SW.direccion_origen, SW.direccion_destino, 
  SW.estado, SW.referencia, SW.fechayhora FROM solicitudweb SW 
  ORDER BY(SW.fechayhora) DESC LIMIT 40 OFFSET page;
END;
//


/*-----  VISTA DE LAS SOLICITUDES ACTUALES (ESTADO PENDIENTE ) -----*/
DROP VIEW IF EXISTS TABLA_SOLICITUDES_PENDIENTES;
    CREATE VIEW TABLA_SOLICITUDES_PENDIENTES AS 
    SELECT CONCAT(PE.nombres,' ', PE.apellidos) AS 'Pasajero' , S.id_solicitud,
    PE.telefono,PA.token, PE.foto, L.direccion_actual, L.direccion_destino,
    L.referencia, L.latitud_origen,L.longitud_origen,
    L.latitud_destino, L.longitud_destino, S.fechayhora, 
    S.estado, S.precio_oferta FROM solicitud S INNER JOIN localizacion L 
    ON L.id_localizacion = S.id_localizacion 
    INNER JOIN pasajero PA ON S.id_pasajero = PA.id_pasajero
    INNER JOIN persona PE ON PA.id_persona = PE.id_persona WHERE S.estado='pendiente' ORDER BY (S.fechayhora) DESC;

/*-----  VISTA DE LA SUMA DE LAS SOLICITUDES ACTUALES (ESTADO PENDIENTE ) -----*/
DROP VIEW IF EXISTS SOLICITUDES_PENDIENTES_SUM;
    CREATE VIEW SOLICITUDES_PENDIENTES_SUM AS 
    SELECT COUNT(IF(estado = 'pendiente', 1, NULL)) 'total_pendientes'
      FROM solicitud;


/*----- VIAJE ACEPTADO POR UN CHOFER -----*/
drop procedure if exists NUEVO_VIAJE;
delimiter //
CREATE PROCEDURE  NUEVO_VIAJE
(
   in id_solicitud INT,
   in id_conductor INT,
   in precio_final FLOAT
)

BEGIN
DECLARE id_viaje INT;
      START TRANSACTION;
        insert into viaje(id_solicitud,	id_conductor,precio_final) values(id_solicitud,id_conductor,precio_final);
        set id_viaje = last_insert_id();
        update solicitud SO set SO.estado = 'aceptado' where SO.id_solicitud = id_solicitud;
        update conductor CO set CO.estado = 'ocupado' where CO.id_conductor = id_conductor;
        if(id_viaje !='NULL') then 
          commit; 
           SELECT id_viaje;
         
        else 
          rollback;
          signal sqlstate '45000' set message_text = 'Error al registrar la solicitud.';
        end if;
END;
//


/*----- PROCEDIMIENTO PARA ACEPTAR UN VIAJE -----*/

drop procedure if exists ACEPTAR_VIAJE;
delimiter //
CREATE PROCEDURE  ACEPTAR_VIAJE(in id_viaje INT)
BEGIN 
  DECLARE id_conductor INT;
    set id_conductor = (select id_conductor from viaje V where V.id_conductor = id_viaje);
    update viaje VI set VI.estado = 'aceptado' where VI.id_viaje = id_viaje ;
    update conductor CO set CO.estado = 'ocupado' where CO.id_conductor = id_conductor;
END;
//




/*----- PROCEDIMIENTO PARA TERMINAR A BORDO -----*/
drop procedure if exists BORDO_VIAJE;
delimiter //
CREATE PROCEDURE  BORDO_VIAJE(in id_viaje INT)

BEGIN 
    update viaje VI set VI.estado = 'abordo', VI.fechayhora_fin = NOW() where VI.id_viaje = id_viaje;
END;
//

/*----- PROCEDIMIENTO PARA TERMINAR UN VIAJE -----*/

drop procedure if exists TERMINAR_VIAJE;
delimiter //
CREATE PROCEDURE  TERMINAR_VIAJE(in id_viaje INT)

BEGIN 
    DECLARE id_conductor INT;
    set id_conductor = (select V.id_conductor from viaje V where V.id_viaje = id_viaje);
    update viaje VI set VI.estado = 'terminado', VI.fechayhora_fin = NOW() where VI.id_viaje = id_viaje;
    update conductor CO set CO.estado = 'activo' where CO.id_conductor = id_conductor;

END;
//


/*----- PROCEDIMIENTO PARA CANCELAR UN VIAJE -----*/

drop procedure if exists CANCELAR_VIAJE;
delimiter //
CREATE PROCEDURE  CANCELAR_VIAJE(in id_viaje INT)

BEGIN 
    DECLARE id_conductor INT;
    set id_conductor = (select V.id_conductor from viaje V where V.id_viaje = id_viaje);
    update viaje VI set VI.estado = 'cancelado', VI.fechayhora_fin = NOW() where VI.id_viaje = id_viaje;
    update conductor CO set CO.estado = 'activo' where CO.id_conductor = id_conductor;

END;
//



/*----- TABLA PARA VISUALIZAR LOS VIAJES FINALIZADOS -----*/
DROP VIEW IF EXISTS TABLA_VIAJE;
    CREATE VIEW TABLA_VIAJE AS
    select 
    CONCAT(PP.nombres,' ',PP.apellidos ) as 'pasajero', 
    CONCAT(PC.nombres,' ',PC.apellidos) as 'conductor',
    LO.direccion_actual,
    LO.direccion_destino,
    LO.latitud_origen,
    LO.longitud_origen,
    LO.latitud_destino,
    LO.longitud_destino,
    VI.precio_final,
    VI.fechayhora_inicio,
    VI.fechayhora_fin,
    VI.estado
    

    from viaje VI
    inner join solicitud SO on VI.id_solicitud = SO.id_solicitud 
    INNER JOIN conductor CO ON VI.id_conductor = CO.id_conductor
    INNER JOIN persona PC ON PC.id_persona = CO.id_persona
    inner join pasajero PA on SO.id_pasajero = PA.id_pasajero 
    inner join persona PP on PP.id_persona = SO.id_pasajero 
    inner join localizacion LO on SO.id_localizacion = LO.id_localizacion
    WHERE VI.estado = 'terminado'
    ORDER BY(VI.fechayhora_fin) DESC;



/*----- PROCEDIMIENTO PARA ENVIAR OPINION Y FINALIZAR UN VIAJE -----*/
drop procedure if exists ENVIAR_OPINION;
delimiter //
CREATE PROCEDURE  ENVIAR_OPINION
(in id_viaje INT, 
 in id_pasajero INT,
 in id_conductor INT,
 in valoracion INT,
 in comentario TEXT)
BEGIN 
DECLARE id_opinion INT;
  START TRANSACTION;
    insert into opinion(id_pasajero,id_conductor,valoracion,comentario) values(id_pasajero,id_conductor,valoracion,comentario);
    set id_opinion = last_insert_id();
    update viaje VI set VI.estado = 'terminado' where VI.id_viaje = id_viaje ;
    update conductor CO set CO.estado = 'activo' where CO.id_conductor = id_conductor;
    if(id_opinion !='NULL') then 
          commit; 
        else 
          rollback;
          signal sqlstate '45000' set message_text = 'Error al registrar la opinion.';
        end if;
  
END;
//

 /*----- Traer informacion del conducti segun el viaje -----*/

drop procedure if exists INFO_DRIVER_TRAVEL;
delimiter //
CREATE PROCEDURE  INFO_DRIVER_TRAVEL
(
   in id_solicitud	INT
)

BEGIN
SELECT VI.id_viaje, PE.nombres, PE.apellidos, PE.foto, PE.telefono, VI.precio_final, VE.placa,VE.marca  FROM persona PE 
INNER JOIN conductor CO ON PE.id_persona = CO.id_persona
INNER JOIN viaje VI ON VI.id_conductor = CO.id_conductor
INNER JOIN vehiculo VE ON VE.id_vehiculo = CO.id_vehiculo
WHERE VI.id_solicitud =id_solicitud;
END;
//




 /*----- Calcular la distancia de dos puntos en KM -----*/

drop procedure if exists DISTANCIA_KM;
delimiter //
CREATE PROCEDURE  DISTANCIA_KM
(in latitud_origen DECIMAL(15,9) ,
in longitud_origen DECIMAL(15,9) ,
 in latitud_destino DECIMAL(15,9) ,
 in longitud_destino DECIMAL(15,9)
)

BEGIN 
 	SELECT  ROUND((6371 * acos( 
                cos( radians(latitud_destino) ) 
              * cos( radians( latitud_origen ) ) 
              * cos( radians( longitud_origen ) - radians(longitud_destino) ) 
              + sin( radians(latitud_destino) ) 
              * sin( radians( latitud_origen ) )
                ) ),1) as distance;
END;
//

 /*----- Calcular de froma ascendiente los choferes mas cercanos -----*/

SELECT C.id_conductor,
 ROUND((6371 * acos( cos( radians(C.latitud) ) * cos( radians(-7.2266614 ) ) 
 * cos( radians(-79.4313578 ) - radians(C.longitud) ) + sin( radians(C.latitud) ) 
 * sin( radians( -7.2266614 ) ) ) ),1) as Distancia 
 FROM conductor C WHERE C.latitud != '' AND C.longitud != '' 
 ORDER BY(Distancia);

 /*----- Calcular del chofer màs cercano-----*/

 
drop procedure if exists CHOFER_CERCA;
delimiter //
CREATE PROCEDURE CHOFER_CERCA
( in latitud_pasajero DECIMAL(15,9),
in longitud_pasajero DECIMAL(15,9))

BEGIN 
SELECT C.id_conductor,ROUND((6371 * acos( cos( radians(C.latitud) ) * cos( radians(latitud_pasajero )) 
 * cos( radians(longitud_pasajero ) - radians(C.longitud) ) + sin( radians(C.latitud)) 
 * sin( radians( latitud_pasajero ) ) ) ),1) as Distancia 
 FROM conductor C WHERE C.latitud != '' AND C.longitud != '' 
 ORDER BY(Distancia);
END;
//


CREATE ALGORITHM=UNDEFINED DEFINER=`motuber`@`localhost` SQL SECURITY DEFINER VIEW `CURRENT_DRIVERS`  AS SELECT `PE`.`nombres` AS `nombres`, `PE`.`apellidos` AS `apellidos`, `PE`.`telefono` AS `telefono`, `PE`.`foto` AS `foto`, `CO`.`latitud` AS `latitud`, `CO`.`longitud` AS `longitud`, `CO`.`estado` AS `estado` FROM (`persona` `PE` join `conductor` `CO` on((`PE`.`id_persona` = `CO`.`id_persona`))) WHERE (`CO`.`estado` <> 'inactivo')  ;

CREATE ALGORITHM=UNDEFINED DEFINER=`vespro`@`localhost` SQL SECURITY DEFINER VIEW `TABLA_SOLICITUDES`  AS SELECT concat(`PE`.`nombres`,' ',`PE`.`apellidos`) AS `Pasajero`, `PE`.`telefono` AS `telefono`, `L`.`direccion_actual` AS `direccion_actual`, `L`.`direccion_destino` AS `direccion_destino`, `L`.`referencia` AS `referencia`, `L`.`latitud_origen` AS `latitud_origen`, `L`.`longitud_origen` AS `longitud_origen`, `L`.`latitud_destino` AS `latitud_destino`, `L`.`longitud_destino` AS `longitud_destino`, `S`.`fechayhora` AS `fechayhora`, `S`.`estado` AS `estado` FROM (((`solicitud` `S` join `localizacion` `L` on((`L`.`id_localizacion` = `S`.`id_localizacion`))) join `pasajero` `PA` on((`S`.`id_pasajero` = `PA`.`id_pasajero`))) join `persona` `PE` on((`PA`.`id_persona` = `PE`.`id_persona`))) ORDER BY `S`.`fechayhora`  ASC  ;

CREATE ALGORITHM=UNDEFINED DEFINER=`vespro`@`localhost` SQL SECURITY DEFINER VIEW `TABLA_SOLICITUDESWEB_PENDIENTES`  AS SELECT `S`.`id_solicitudweb` AS `id_solicitudweb`, `S`.`nombre` AS `nombre`, `S`.`apellido` AS `apellido`, `S`.`dni` AS `dni`, `S`.`estado` AS `estado`, `S`.`telefono` AS `telefono`, `S`.`direccion_origen` AS `direccion_origen`, `S`.`direccion_destino` AS `direccion_destino`, `S`.`referencia` AS `referencia`, `S`.`fechayhora` AS `fechayhora` FROM `solicitudweb` AS `S` WHERE (`S`.`estado` = 'pendiente') ORDER BY `S`.`fechayhora` ASC  ;

CREATE ALGORITHM=UNDEFINED DEFINER=`motuber`@`localhost` SQL SECURITY DEFINER VIEW `SOLICITUDES_PENDIENTES_SUM` AS SELECT count(if((`solicitud`.`estado` = 'pendiente'),1,NULL)) AS `total_pendientes` FROM `solicitud`;

CREATE ALGORITHM=UNDEFINED DEFINER=`vespro`@`localhost` SQL SECURITY DEFINER VIEW `TABLA_SOLICITUDES_PENDIENTES`  AS SELECT concat(`PE`.`nombres`,' ',`PE`.`apellidos`) AS `Pasajero`, `S`.`id_solicitud` AS `id_solicitud`, `PE`.`telefono` AS `telefono`, `PA`.`token` AS `token`, `PE`.`foto` AS `foto`, `L`.`direccion_actual` AS `direccion_actual`, `L`.`direccion_destino` AS `direccion_destino`, `L`.`referencia` AS `referencia`, `L`.`latitud_origen` AS `latitud_origen`, `L`.`longitud_origen` AS `longitud_origen`, `L`.`latitud_destino` AS `latitud_destino`, `L`.`longitud_destino` AS `longitud_destino`, `S`.`fechayhora` AS `fechayhora`, `S`.`estado` AS `estado`, `S`.`precio_oferta` AS `precio_oferta` FROM (((`solicitud` `S` join `localizacion` `L` on((`L`.`id_localizacion` = `S`.`id_localizacion`))) join `pasajero` `PA` on((`S`.`id_pasajero` = `PA`.`id_pasajero`))) join `persona` `PE` on((`PA`.`id_persona` = `PE`.`id_persona`))) WHERE (`S`.`estado` = 'pendiente') ORDER BY `S`.`fechayhora` ASC  ;