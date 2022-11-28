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
    return;
  }

  const prestamo = await prisma.prestamo.create({
    data: {
      userId,
      itemId,
      Cantidad: cantidad,
    },
  });
  res.status(200).json(prestamo);
}
