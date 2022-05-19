import {Router} from 'express';
import { 
    postTravel,
    postTravelAcept,
    postTravelBordo,
    postTravelFinish,
    getTravels,
    getDriverTravel,
    getStateTravel,
    postCancelTravel,
    sendOpinion,
    getTravelsweb,
    aceptTravelWeb,
    sendTravelWebTerminated } 
from '../controllers/travel';

let multer = require('multer');
let formdata = multer();

const router = Router();

router.post(
    "/viaje",
    [formdata.fields([])],
    postTravel
)
router.post(
    "/viajeinfo",
    [formdata.fields([])],
    getDriverTravel
)

router.post(
    "/viajeaceptar",
    [formdata.fields([])],
    postTravelAcept
)
router.post(
    "/viajeabordo",
    [formdata.fields([])],
    postTravelBordo
)
router.post(
    "/viajecancelar",
    [formdata.fields([])],
    postCancelTravel
)

router.post(
    "/aceptarviajeweb",
    [formdata.fields([])],
    aceptTravelWeb
)


router.post(
    "/finalizarviaje",
    [formdata.fields([])],
    aceptTravelWeb
)
router.post(
    "/viajewebfinalizar",
    [formdata.fields([])],
    sendTravelWebTerminated
)
router.post(
    "/viajeappfinalizar",
    [formdata.fields([])],
    postTravelFinish
)
router.get(
    "/viajestate/:id_travel",
    [formdata.fields([])],
    getStateTravel
)

router.get(
    "/viaje",
    getTravels
)


router.get(
    "/viajeweb",
    getTravelsweb
)
router.post(
    "/opinion",
    [formdata.fields([])],

    sendOpinion
)

export default router;