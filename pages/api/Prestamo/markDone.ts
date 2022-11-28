import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../_db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body;
  if (!id) {
    res.status(400);
    return;
  }
  const prestamo = await prisma.prestamo.update({
    where: { id },
    data: {
      FechaDevolucion: new Date(),
    },
  });
  res.status(200);
}
