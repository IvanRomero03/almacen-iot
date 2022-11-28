import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../_db";
import { Item } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { id } = req.body;
  if (!id) {
    res.status(400);
    return;
  }
  const item = await prisma.item.findUnique({
    where: { id },
  });

  const disponibilidad = await prisma.celdaItem.aggregate({
    where: {
      itemId: id,
    },
    _sum: {
      existencia: true,
    },
  });

  disponibilidad._sum.existencia;

  res.status(200).json({
    ...item,
    existencia: disponibilidad._sum.existencia,
  });
}
