import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../_db";
import { Item } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Item>
) {
  const { id } = req.body;
  if (!id) {
    res.status(400);
    return;
  }
  const item = await prisma.item.delete({
    where: { id },
  });
  res.status(200).json(item);
}
