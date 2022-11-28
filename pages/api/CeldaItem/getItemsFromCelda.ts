import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../_db";
import { CeldaItem, Item, Celda } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ Item: Item; existencia: number }[]>
) {
  const { id } = req.body;
  if (!id) {
    res.status(400);
    return;
  }
  const celdaItems = await prisma.celdaItem.findMany({
    where: { celdaId: id },
    select: { Item: true, existencia: true },
  });

  res.status(200).json(celdaItems);
}
