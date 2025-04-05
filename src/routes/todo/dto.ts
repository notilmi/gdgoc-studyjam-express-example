/**
 * Data Transfer Objecrs
 */
import { z } from "zod";

export const CreateTodoDTO = z.object({
  name: z.string(),
});

export const UpdateTodoDTO = CreateTodoDTO.extend({
  status: z.boolean().optional(),
});
