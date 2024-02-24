import { Router } from "express";
import { advertController } from "../controllers/advert.controllers";

const router = Router();


router.route("/").get(advertController.getAdverts);


export { router };
