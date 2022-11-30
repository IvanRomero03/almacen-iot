import { prisma } from "../_db";
import io from "socket.io-client";

export default async function handler(req, res) {
  const { userId, itemId, quantity } = req.body;

  if (!userId || !itemId || !quantity) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const userCredential = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      credential: true,
    },
  });

  if (!userCredential) {
    return res.status(401).json({ message: "User not found" });
  }

  const celdasWithItem = await prisma.celdaItem.findMany({
    where: {
      itemId,
      existencia: {
        gte: quantity,
      },
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

  if (celdasWithItem.length === 0) {
    return res.status(401).json({ message: "Item not found" });
  }

  let quantityLeft = quantity;
  let celdasToUse = [];

  for (let i = 0; i < celdasWithItem.length; i++) {
    if (quantityLeft === 0) {
      break;
    }

    if (celdasWithItem[i].existencia >= quantityLeft) {
      celdasToUse.push({
        celdaId: celdasWithItem[i].Celda.id,
        existencia: quantityLeft,
      });
      quantityLeft = 0;
    } else {
      celdasToUse.push({
        celdaId: celdasWithItem[i].Celda.id,
        existencia: celdasWithItem[i].existencia,
      });
      quantityLeft -= celdasWithItem[i].existencia;
    }
  }

  if (quantityLeft > 0) {
    return res.status(401).json({ message: "Not enough items" });
  }

  //const socket = io("ws://almacne-iot.us-east-1.elasticbeanstalk.com");
  const socket = io("http://localhost:3000");
  console.log({
    credencial: userCredential,
    celdas: celdasToUse,
  });
  socket.on("connect", () => {
    //socket.emit("mensaje", "Hola mundo");
    socket.emit("createPetition", {
      credencial: userCredential,
      celdas: celdasToUse,
      prestamoInfo: {
        userId,
        itemId,
        quantity,
      },
    });
    socket.close();
  });

  res.status(200).json();
}
