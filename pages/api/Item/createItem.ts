import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../_db";
import { Item } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Item>
) {
  const { name, description, category, department } = req.body;
  const item = await prisma.item.create({
    data: {
      name,
      description,
      category,
      department,
    },
  });
  res.status(200).json(item);
}
