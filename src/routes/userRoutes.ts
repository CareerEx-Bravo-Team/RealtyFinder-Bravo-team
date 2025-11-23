import express from "express";
import { getUsersByIndividual, getUsersByPropertyOwner, getUsersByRealEstateAgent } from "../controllers/userControllers";

const router = express.Router();







router.get("/role/individual", getUsersByIndividual);
router.get("/role/property_owner", getUsersByPropertyOwner);
router.get("/role/real_estate_agent", getUsersByRealEstateAgent);



export default router;