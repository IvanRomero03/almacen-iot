import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../_db";
import { CeldaItem, Item, Celda } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CeldaItem>
) {
  const { idItem, idCelda, num } = req.body;
  if (!idItem || !idCelda || !num) {
    res.status(400);
    return;
  }
  //modificar existencia
  const idCeldaItem = await prisma.item.findUnique({
    where: { id: idItem },
    select: {
      CeldaItem: { where: { celdaId: idCelda }, select: { id: true } },
    },
  });

  const celdaItem = await prisma.celdaItem.update({
    where: { id: idCeldaItem?.CeldaItem[0].id },
    data: {
      existencia: {
        set: num,
      },
    },
  });
  res.status(200).json(celdaItem);
}
