import { prisma } from "../_db";
import io from "socket.io-client";

export default async function handler(req, res) {
  const { itemId, quantity, idPrestamo } = req.body;

  if ((!itemId || !quantity, !idPrestamo)) {
    res.status(400).json({ error: "Missing required fields" });
  }

  // Encontrar la celda con mayor existencia del item
  const celdaWithItem = await prisma.celdaItem.findFirst({
    where: {
      itemId: itemId,
    },
    select: {
      Celda: {
        select: {
          id: true,
        },
      },
      existencia: true,
    },
    orderBy: {
      existencia: "desc",
    },
  });

  const socket = io("ws://almacne-iot.us-east-1.elasticbeanstalk.com");

  if (!celdaWithItem) {
    // abrir la primera celda

    // update celdaItem with Celda 1
    const idCeldaItem = await prisma.celdaItem.findFirst({
      where: {
        itemId: itemId,
        celdaId: 1,
      },
      select: {
        id: true,
      },
    });

    if (!idCeldaItem) {
      await prisma.celdaItem.create({
        data: {
          itemId: itemId,
          celdaId: 1,
          existencia: quantity,
        },
      });
    } else {
      await prisma.celdaItem.update({
        where: {
          id: idCeldaItem.id,
        },
        data: {
          existencia: {
            increment: quantity,
          },
        },
      });
    }
    socket.on("connect", () => {
      socket.emit("open", "1");
      socket.on("openResponse", () => {
        socket.close();
      });
    });
  } else {
    // abrir la celda con mayor existencia

    // update celdaItem with Celda = celdaWithItem.Celda.id

    const idCeldaItem = await prisma.celdaItem.findFirst({
      where: {
        itemId: itemId,
        celdaId: celdaWithItem.Celda.id,
      },
      select: {
        id: true,
      },
    });

    if (!idCeldaItem) {
      await prisma.celdaItem.create({
        data: {
          itemId: itemId,
          celdaId: celdaWithItem.Celda.id,
          existencia: quantity,
        },
      });
    } else {
      await prisma.celdaItem.update({
        where: {
          id: idCeldaItem.id,
        },
        data: {
          existencia: {
            increment: quantity,
          },
        },
      });
    }
    socket.on("connect", () => {
      socket.emit("open", celdaWithItem.Celda.id);
      socket.on("on", () => {
        socket.close();
      });
    });
  }

  await prisma.prestamo.update({
    where: {
      id: idPrestamo,
    },
    data: {
      FechaDevolucion: new Date(),
    },
  });

  res.status(200).json({ message: "Item added" });
}
