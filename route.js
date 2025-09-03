import express from "express";
import createHost from "./api/HostInfo.js";

const router = express.Router();

router.post("/hosts", createHost);




export default router;
