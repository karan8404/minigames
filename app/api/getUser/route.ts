import { NextRequest} from "next/server";
import { PrismaClient } from "@prisma/client";
import { options } from "../auth/[...nextauth]/options";

export const prisma = new PrismaClient();

const getUser = async (req: NextRequest) => {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json(
    { userID: user?.id, name: user?.name },
    { status: 200 }
  );
};

export { getUser as GET };
