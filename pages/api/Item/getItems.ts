import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../_db";
import { Item } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    {
      id: number;
    }[]
  >
) {
  const items = await prisma.item.findMany({
    select: {
      id: true,
    },
  });
  res.status(200).json(items);
}
