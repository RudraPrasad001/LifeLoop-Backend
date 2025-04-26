import express from "express";
import routes from "../RoutesHandler/profileRoutesHandler.js";
const profileRouter = express.Router();
profileRouter.get("/:id",routes.getProfilePosts);

export default profileRouter;