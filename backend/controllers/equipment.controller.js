import { ValidationError } from "../errors/errors.js";
import { equipmentService } from "../services/equipment.service.js";
import { qrCodeService } from "../services/qr-code.service.js";
import { handleControllerError } from "../utils/error-handler.js";
import { validateStatus } from "../utils/validate-status.js";
import { validateUuid } from "../utils/validate-uuid.js";

function parsePositiveInteger(value, fieldName) {
  if (value === undefined) {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    throw new ValidationError(`${fieldName} must be an integer`);
  }

  if (parsed <= 0) {
    throw new ValidationError(`${fieldName} must be a positive integer`);
  }

  return parsed;
}

function parseIdsList(value) {
  if (value === undefined) {
    return undefined;
  }

  const ids = value.split(",").map((id) => {
    const parsed = Number(id.trim());

    if (!Number.isInteger(parsed)) {
      throw new ValidationError("room_id must contain only integers");
    }

    if (parsed <= 0) {
      throw new ValidationError("room_id must contain only positive integers");
    }

    return parsed;
  });

  return ids;
}

function parseStatus(value) {
  if (value === undefined) {
    return undefined;
  }

  const status = validateStatus(value);

  return status;
}

class EquipmentController {
  getById(req, res) {
    try {
      const equipment = equipmentService.getById(req.params.id);
      return res.json(equipment);
    } catch (error) {
      return handleControllerError(error, res);
    }
  }

  getByUuid(req, res) {
    try {
      const equipment = equipmentService.getByUuid(req.params.uuid);
      return res.json(equipment);
    } catch (error) {
      return handleControllerError(error, res);
    }
  }

  getAll(req, res) {
    try {
      const { limit, room_id, status } = req.query;

      const filters = {
        limit: parsePositiveInteger(limit, "limit"),
        roomIds: parseIdsList(room_id),
        status: parseStatus(status),
      };
      const equipments = equipmentService.getAll(filters);
      return res.json(equipments);
    } catch (error) {
      return handleControllerError(error, res);
    }
  }

  create(req, res) {
    try {
      const equipment = equipmentService.create(req.body);
      return res.status(201).json(equipment);
    } catch (error) {
      return handleControllerError(error, res);
    }
  }

  update(req, res) {
    try {
      const equipment = equipmentService.update(req.params.id, req.body);

      return res.status(200).json(equipment);
    } catch (error) {
      return handleControllerError(error, res);
    }
  }

  writeOff(req, res) {
    try {
      equipmentService.writtenOff(req.params.id);

      return res.status(204).send();
    } catch (error) {
      return handleControllerError(error, res);
    }
  }

  forceDelete(req, res) {
    try {
      equipmentService.forceDelete(req.params.id);

      return res.status(204).send();
    } catch (error) {
      return handleControllerError(error, res);
    }
  }

  async getQrByUuid(req, res) {
    try {
      const { uuid } = req.params;

      const validUuid = validateUuid(uuid);
      const equipment = equipmentService.getByUuid(validUuid);

      const qrSvg = await qrCodeService.generateSvg(equipment.uuid);

      res.type("image/svg+xml");
      return res.send(qrSvg);
    } catch (error) {
      return handleControllerError(error, res);
    }
  }
}

export const equipmentController = new EquipmentController();
