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
  const prestamos = await prisma.prestamo.findUnique({
    where: { id },
    include: {
      Item: {
        select: {
          name: true,
          category: true,
          department: true,
          id: true,
        },
      },
      User: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
  res.status(200).json(prestamos);
}
