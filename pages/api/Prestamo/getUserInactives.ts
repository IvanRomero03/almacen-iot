import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../_db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body;
  if (!id) {
    res.status(400).json({ error: "Missing id" });
    return;
  }

  const response = await prisma.prestamo.findMany({
    where: {
      userId: Number(id),
      NOT: {
        FechaDevolucion: null,
      },
    },
    select: {
      id: true,
    },
  });

  res.json(response);
}
