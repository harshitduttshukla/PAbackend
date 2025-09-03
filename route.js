import express from "express";
import createHost from "./api/HostInfo.js";
import {getAllHosts,deleteHost} from "./api/hostListPage.js"

const router = express.Router();

router.post("/hosts", createHost);
router.get("/hostsList", getAllHosts);
router.delete("/deleteHost/:id", deleteHost);  





export default router;
