import { clerkMiddleware } from "@clerk/express";
import { env } from "@interior-design-ai/env/server";
import cors from "cors";
import express from "express";
import { requireAuth } from "./middleware/auth.js";
import generationsRouter from "./routes/generations.js";
import housesRouter from "./routes/houses.js";
import paymentsRouter from "./routes/payments.js";
import roomsRouter from "./routes/rooms.js";

const app = express();

app.use(
	cors({
		origin: env.CORS_ORIGIN,
		methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

app.use(clerkMiddleware());
app.use(express.json());

app.get("/", (_req, res) => {
	res.status(200).send("OK");
});

// Authenticated API routes
const api = express.Router();
api.use(requireAuth);
api.use("/houses", housesRouter);
api.use("/houses/:houseId/rooms", roomsRouter);
api.use("/houses/:houseId", generationsRouter);
api.use("/generations", generationsRouter);
api.use("/credits", paymentsRouter);

app.use("/api/v1", api);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
