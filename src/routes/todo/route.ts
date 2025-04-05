import express, { Request, Response } from "express";
import { createTodo, deleteTodo, getTodo, updateTodo } from "./plu";
import { validateData } from "../../middlewares/validator";
import { CreateTodoDTO, UpdateTodoDTO } from "./dto";
import { z } from "zod";

export const todoRouter = express.Router();

todoRouter.get("/", async (_, res: Response) => {
  const todoRes = await getTodo();

  if (todoRes.isErr()) {
    res.status(todoRes.error.code).json({ message: todoRes.error.message });
    return;
  }

  res
    .status(200)
    .json({ message: "Successfully Queried Todos", data: todoRes.value });
  return;
});

todoRouter.post(
  "/",
  validateData(CreateTodoDTO),
  async (req: Request, res: Response) => {
    const newTodoRequest = req.body as z.infer<typeof CreateTodoDTO>;

    const newTodoRes = await createTodo(newTodoRequest);

    if (newTodoRes.isErr()) {
      res
        .status(newTodoRes.error.code)
        .json({ message: newTodoRes.error.message });
      return;
    }

    res
      .status(200)
      .json({ message: "Successfully Created Todos", data: newTodoRes.value });
  }
);

todoRouter.put(
  "/:id",
  validateData(UpdateTodoDTO),
  async (req: Request, res: Response) => {
    const updateTodoRequest = req.body as z.infer<typeof UpdateTodoDTO>;

    const updateTodoRes = await updateTodo(req.params.id, updateTodoRequest);

    if (updateTodoRes.isErr()) {
      res
        .status(updateTodoRes.error.code)
        .json({ message: updateTodoRes.error.message });
      return;
    }

    res.status(200).json({
      message: "Successfully Updated Todos",
      data: updateTodoRes.value,
    });
  }
);

todoRouter.delete("/:id", async (req: Request, res: Response) => {
  const deleteTodoId = req.params.id as string;
  const deleteTodoRes = await deleteTodo(deleteTodoId);

  if (deleteTodoRes.isErr()) {
    res
      .status(deleteTodoRes.error.code)
      .json({ message: deleteTodoRes.error.message });
    return;
  }

  res.status(200).json({
    message: "Successfully Deleted Todos",
    data: deleteTodoRes.value,
  });
});
