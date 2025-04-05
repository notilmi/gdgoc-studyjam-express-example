import express, { Response } from "express";
import { todoRouter } from "./routes/todo/route";

const PORT = process.env.PORT ?? 3000;

const server = express();

server.use(express.json());

server.get("/", (_, res: Response) => {
  res.json({
    message: "OK",
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});
server.use("/todos", todoRouter);

server.listen(PORT, () => {
  console.log(`🚀 App listening on port: ${PORT}`);
});
