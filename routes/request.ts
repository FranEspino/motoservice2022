import {Router} from 'express';
import { 
    postRequest,
    getRequest,
    postCancelRequest,
    getStateRequest, 
    getRequestPending,
    getSumRequest,
    postRequestWeb,
    getRequestWeb,
    getRequestWebPending,
    getRequestWebAcept,
    getRequestWebCancel ,
    getRequestWebId,
    getRequestWebTerminado,
    getSumRequestApp,
    getSumTodayRequestApp,
    getRequestAppPag,
    getSumRequestWeb,
    getSumTodayRequestWeb,
    getRequestWebPag
} from '../controllers/request';
let multer = require('multer');
let formdata = multer();

const router = Router();
router.get(
    "/solicitud",
    getRequest
);
router.get(
    "/solicitudsum",
    getSumRequest
);
router.get(
    "/solicitudpendiente",
    getRequestPending
);
router.get(
    "/solicitud/:id_solicitud",
    getStateRequest
  );
router.post(
    "/solicitud",
    [formdata.fields([])],
    postRequest
);
router.post(
    "/solicitudcancel",
    [formdata.fields([])],
    postCancelRequest
)
router.post(
    "/solicitudweb",
    [formdata.fields([])],
    postRequestWeb
)
router.get(
    "/solicitudweb",
    getRequestWeb
  );
  router.get(
    "/solicitudwebpending",
    getRequestWebPending
  );
  router.post(
    "/solicitudwebacept",
    [formdata.fields([])],
    getRequestWebAcept
)
router.post(
    "/solicitudwebterminar",
    [formdata.fields([])],
    getRequestWebTerminado
)

router.post(
    "/solicitudwebcancel",
    [formdata.fields([])],
    getRequestWebCancel
)
  router.get(
    "/requestapppag/:numero_pagina",
    [formdata.fields([])],
    getRequestAppPag
)
router.get(
    "/requestwebpag/:numero_pagina",
    [formdata.fields([])],
    getRequestWebPag
)

router.get(
    "/solicitudwebid/:id_requestweb",
    getRequestWebId
)

router.get(
    "/sumrequestapp",
    getSumRequestApp
)

router.get(
    "/sumrequestweb",
    getSumRequestWeb
)


router.get(
    "/sumtodayrequestapp",
    getSumTodayRequestApp
)


router.get(
    "/sumtodayrequestweb",
    getSumTodayRequestWeb
)








export default router;