import express, { Response } from "express";
import { todoRouter } from "./routes/todo/route";
import { authRoutes } from "./routes/auth/route";
import cookieParser from "cookie-parser";
import { authenticate } from "./middlewares/auth";
const PORT = process.env.PORT ?? 3000;

const server = express();

server.use(express.json());
server.use(cookieParser());

server.get("/", (_, res: Response) => {
  res.json({
    message: "OK",
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

server.use("/todos", authenticate, todoRouter);
server.use("/auth", authRoutes);

server.listen(PORT, () => {
  console.log(`🚀 App listening on port: ${PORT}`);
});
