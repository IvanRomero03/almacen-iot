import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../_db";
import { Prestamo } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Prestamo>
) {
  console.log("prestamo");
  const { userId, itemId, cantidad } = req.body;
  if (!userId || !itemId || !cantidad) {
    res.status(400);
  }
  console.log("prestamo");

  const prestamo = await prisma.prestamo.create({
    data: {
      userId,
      itemId,
      Cantidad: cantidad,
    },
  });
  console.log("prestamo");
  const celdasWithItem = await prisma.celdaItem.findMany({
    where: {
      itemId,
      existencia: {
        gte: cantidad,
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
  console.log("prestamo");

  let cantidadRestante = cantidad;
  const celdasToUpdate = [] as any;
  celdasWithItem.forEach((celda) => {
    if (cantidadRestante > 0) {
      const existencia = celda.existencia;
      if (existencia > cantidadRestante) {
        celdasToUpdate.push({
          celda: celda.Celda.id,
          existencia: cantidadRestante,
        });
        cantidadRestante = 0;
      } else {
        celdasToUpdate.push({
          celda: celda.Celda.id,
          existencia: existencia,
        });
        cantidadRestante -= existencia;
      }
    }
  });
  console.log("prestamo");
  if (cantidadRestante > 0) {
    res.status(400);
  }

  if (celdasToUpdate.length < 1) {
    res.status(400);
  }

  await prisma.celdaItem.updateMany({
    where: {
      itemId,
      Celda: {
        id: {
          in: celdasToUpdate.map(
            (celda: { celda: number; existencia: number }) => celda.celda
          ),
        },
      },
    },
    data: {
      existencia: {
        decrement: celdasToUpdate.map(
          (celda: { celda: number; existencia: number }) => celda.existencia
        ),
      },
    },
  });

  res.status(200).json(prestamo);
}
