import Link from "next/link";
import { SignOutButton } from "~/components/clients/signout";
import { auth } from "~/server/auth";
import { db } from "~/server/db";




export default async function HomePage() {
  const session = await auth();

  const quota = await db.apiQuota.findUniqueOrThrow({
    where: {
      userId: session?.user.id,
    },
  });

  return (
    
      <nav className="flex h-16 items-center justify-between border-b border-gray-200 px-10">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-800 text-white">
            SA
          </div>
          <span className="text-lg font-medium">Sentiment Analysis</span>
        </div>

        <SignOutButton />
      </nav>

  );
}
