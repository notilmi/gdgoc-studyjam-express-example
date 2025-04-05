/**
 * Procedure Logical Units
 */
import { z } from "zod";
import { CreateTodoDTO, UpdateTodoDTO } from "./dto";
import { db } from "../../lib/db";
import { err, ok } from "neverthrow";
import { createPluError } from "../../lib/utils/plu-output-handler";
import { StatusCodes } from "http-status-codes";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function getTodo() {
  try {
    const todos = await db.todo.findMany();

    return ok(todos);
  } catch (error) {
    console.error(error);
    return err(createPluError("Internal Server Error"));
  }
}

export async function getTodoById(id: string) {
  try {
    const todo = await db.todo.findUnique({ where: { id } });

    if (!todo)
      return err(createPluError("Todo Tidak Ditemukan", StatusCodes.NOT_FOUND));

    return ok(todo);
  } catch (error) {
    console.error(error);
    return err(createPluError("Internal Server Error"));
  }
}

export async function createTodo(todo: z.infer<typeof CreateTodoDTO>) {
  try {
    const newTodo = await db.todo.create({ data: todo });

    if (!newTodo)
      return err(
        createPluError(
          "Terjadi Kesalahan Saat Menulis Data",
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );

    return ok(newTodo);
  } catch (error) {
    console.error(error);
    return err(createPluError("Internal Server Error"));
  }
}

export async function updateTodo(
  id: string | undefined,
  todo: z.infer<typeof UpdateTodoDTO>
) {
  try {
    if (!id)
      return err(createPluError("ID Tidak Ditemukan", StatusCodes.NOT_FOUND));

    const updatedTodo = await db.todo.update({
      where: {
        id,
      },
      data: todo,
    });

    if (!updatedTodo)
      return err(
        createPluError(
          "Gagal Meng-update Todo",
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );

    return ok(updatedTodo);
  } catch (error) {
    console.error(error);
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return err(createPluError("TODO Tidak Ditemukan", StatusCodes.NOT_FOUND));
    }

    return err(createPluError("Internal Server Error"));
  }
}

export async function deleteTodo(id: string) {
  try {
    if (!id)
      return err(createPluError("ID Tidak Ditemukan", StatusCodes.NOT_FOUND));

    const deletedTodo = await db.todo.delete({
      where: {
        id,
      },
    });

    return ok(deletedTodo);
  } catch (error) {
    console.error(error);
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return err(createPluError("TODO Tidak Ditemukan", StatusCodes.NOT_FOUND));
    }

    return err(createPluError("Internal Server Error"));
  }
}
