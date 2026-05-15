import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { pollRoutes, publicPollRoutes } from "../modules/poll/poll.routes.js";

export const apiRoutes = Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/polls", pollRoutes);
apiRoutes.use("/public/polls", publicPollRoutes);
