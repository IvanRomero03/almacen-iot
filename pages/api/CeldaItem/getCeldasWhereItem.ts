import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../_db";
import { CeldaItem, Item, Celda } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    {
      Celda: Celda;
      existencia: number;
    }[]
  >
) {
  const { idItem } = req.body;
  if (!idItem) {
    res.status(400);
    return;
  }
  const celdas = await prisma.celdaItem.findMany({
    where: { itemId: idItem },
    select: { Celda: true, existencia: true },
  });

  res.status(200).json(celdas);
}
