import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { options } from "../auth/[...nextauth]/options";

export const prisma = new PrismaClient();

const getUser = async (req: NextRequest) => {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(
    { userID: user?.id, name: user?.name },
    { status: 200 }
  );
};

export { getUser as GET };
