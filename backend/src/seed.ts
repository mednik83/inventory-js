import { prisma } from "./database/prisma.js";
import { v4 as uuidv4 } from "uuid";

async function main() {
  await prisma.$transaction(async (tx) => {
    if ((await tx.room.count()) > 0) {
      console.info("already seeded");
      return;
    }
    const room_101 = await tx.room.create({
      data: {
        name: "Room 101",
      },
    });

    const room_102 = await tx.room.create({
      data: {
        name: "Room 102",
      },
    });

    const room_103 = await tx.room.create({
      data: {
        name: "Room 103",
      },
    });

    await tx.equipment.create({
      data: {
        name: "Monitor Dell",
        room_id: room_101.id,
        status: "written_off",
        uuid: uuidv4(),
        operations: {
          create: [
            { type: "create", comment: 'Equipment "Monitor Dell" was created' },
            {
              type: "write_off",
              comment: 'Equipment "Monitor Dell" was written off',
            },
          ],
        },
      },
    });

    await tx.equipment.create({
      data: {
        name: "PC Lenovo",
        room_id: room_103.id,
        status: "active",
        uuid: uuidv4(),
        operations: {
          create: [
            { type: "create", comment: 'Equipment "PC Lenovo" was created' },
            {
              type: "move",
              comment:
                'Equipment "PC Lenovo" was moved from Room 101 to Room 103',
            },
          ],
        },
      },
    });

    await tx.equipment.create({
      data: {
        name: "Keyboard Defender",
        room_id: room_102.id,
        status: "active",
        uuid: uuidv4(),
        operations: {
          create: [
            {
              type: "create",
              comment: 'Equipment "Keyboard Defender" was created',
            },
            {
              type: "update",
              comment: 'Equipment "Keyboard Defender" was updated',
            },
          ],
        },
      },
    });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
