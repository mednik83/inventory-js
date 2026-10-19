import * as z from "zod";
import { EQUIPMENT_STATUSES, ALLOWED_OPERATIONS } from "../types.js";

export const IdZod = z
  .union([z.string(), z.number()], { error: "Invalid ID" })
  .pipe(
    z.coerce
      .number<string | number>({ error: "Invalid ID" })
      .int({ error: "Invalid ID" })
      .positive({ error: "Id must contain only positive integers" }),
  );

export const UuidZod = z.uuid({ error: "Invalid uuid" });

export const EquipmentStatusZod = z.enum(EQUIPMENT_STATUSES, {
  error: "Invalid status",
});

export const EquipmentZod = z.object(
  {
    name: z
      .string({ error: "Invalid equipment data" })
      .trim()
      .min(2, { error: "The name is too short" }),
    room_id: z.coerce
      .number({ error: "The room id must be a positive integer" })
      .int({ error: "The room id must be a positive integer" })
      .positive({ error: "The room id must be a positive integer" }),
    status: z
      .string({ error: "Invalid equipment data" })
      .trim()
      .pipe(EquipmentStatusZod),
  },
  { error: "Invalid equipment data" },
);

export const RoomZod = z.object(
  {
    name: z
      .string({ error: "The room name can be string" })
      .trim()
      .min(1, { error: "The room name can not be empty" })
      .min(2, { error: "The room name is too short or empty" }),
  },
  { error: "Invalid room data" },
);

export const OperationZod = z.object({
  type: z.enum(ALLOWED_OPERATIONS, {
    error: (issue) =>
      `Operation "${String(issue.input)}" is not allowed. Expected one of: ${ALLOWED_OPERATIONS.join(", ")}.`,
  }),
  comment: z
    .string({ error: "Status must be a string" })
    .trim()
    .nullish()
    .transform((val) => val || null),
});

export const MoveEquipmentZod = z.object(
  { room_id: IdZod },
  { error: "Invalid data" },
);

export type EquipmentBody = z.infer<typeof EquipmentZod>;
export type RoomBody = z.infer<typeof RoomZod>;
