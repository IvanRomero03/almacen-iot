import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../_db";
import { Prestamo } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Prestamo>
) {
  const { userId, itemId, cantidad } = req.body;
  if (!userId || !itemId || !cantidad) {
    res.status(400);
  }

  const prestamo = await prisma.prestamo.create({
    data: {
      userId,
      itemId,
      Cantidad: cantidad,
    },
  });
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
  if (cantidadRestante > 0) {
    res.status(400);
  }

  if (celdasToUpdate.length < 1) {
    res.status(400);
  }

  const celdasUpdate = [] as any;

  for (let i = 0; i < celdasToUpdate.length; i++) {
    const celda = celdasToUpdate[i];
    const id = await prisma.celdaItem.findFirst({
      where: {
        Item: {
          id: itemId,
        },
        Celda: {
          id: celda.celda,
        },
      },
      select: {
        id: true,
      },
    });
    celdasUpdate.push({
      id: id,
      existencia: celda.existencia,
    });
  }

  celdasUpdate.forEach(async (celda: any) => {
    const asd = await prisma.celdaItem.update({
      where: {
        id: celda.id.id,
      },
      data: {
        existencia: {
          decrement: celda.existencia,
        },
      },
    });
    console.log(asd);
  });

  res.status(200).json(prestamo);
}
