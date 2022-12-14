import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../_db";
import { Prestamo } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    {
      id: number;
    }[]
  >
) {
  const { id } = req.body;
  if (!id) {
    res.status(400);
    return;
  }
  const prestamos = await prisma.prestamo.findMany({
    where: { userId: id, FechaDevolucion: null },
    select: {
      id: true,
    },
  });
  res.status(200).json(prestamos);
}
