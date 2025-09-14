import express from "express";
import createHost from "./api/Hostapi/HostInfo.js";
import {getAllHosts,deleteHost, updateHost} from "./api/Hostapi/hostListPage.js"

const router = express.Router();


// Host 
router.post("/hosts", createHost);
router.get("/hostsList", getAllHosts);
router.delete("/deleteHost/:id", deleteHost);
router.put("/updateHost/:id", updateHost);


// property
import { getPinCode,getHost,createProperty } from "./api/Property/propertyinfo.js"
import { Pincode } from "./api/Pincode/Pincodeinfo.js";
import {AllPinCode} from "./api/Pincode/PincodeListPage.js"


// pincode 
router.post("/Pincode",Pincode)
router.get("/AllPinCode",AllPinCode)





router.get("/PinCode",getPinCode);
router.get("/host",getHost);

router.post("/properties", createProperty);

import { getallProperty,deleteProperty} from "./api/Property/propertyListPage.js";

router.get("/properties",getallProperty);

router.delete("/deleteProperty/:id",deleteProperty)


// client
import {insertClient} from "./api/Client/Clientinfo.js"
router.post("/insertClient", insertClient);


export default router;
