export const EQUIPMENT_STATUSES = [
  "active",
  "inactive",
  "written_off",
] as const;

export const ALLOWED_OPERATIONS = [
  "create",
  "update",
  "delete",
  "move",
  "write_off",
] as const;

export type EquipmentStatus = (typeof EQUIPMENT_STATUSES)[number];
export type OperationType = (typeof ALLOWED_OPERATIONS)[number];

export interface Equipment {
  id: number;
  uuid: string;
  name: string;
  room_id: number;
  status: EquipmentStatus;
}

export interface Operation {
  id: number;
  equipment_id: number;
  type: OperationType;
  comment: string | null;
  created_at: string;
}

export interface Room {
  id: number;
  name: string;
}

export interface EquipmentWithRoom extends Equipment {
  room_name: string;
}

export interface EquipmentFilters {
  limit?: number;
  roomIds?: number[];
  status?: EquipmentStatus;
}

export type EquipmentFormData = Omit<Equipment, "id">;
export type RoomFormData = Omit<Room, "id">;
