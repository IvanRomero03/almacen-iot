import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../_db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    {
      id: number;
    }[]
  >
) {
  const prestamos = await prisma.prestamo.findMany({
    where: {
      NOT: {
        FechaDevolucion: null,
      },
    },
    select: {
      id: true,
    },
  });
  res.status(200).json(prestamos);
}
