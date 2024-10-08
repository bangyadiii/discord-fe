import { JoinServerModal } from "@/components/modals/join-server-modal";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";

interface Member {
  userId: string;
  user: {
    id: string;
    name: string;
  };
}

interface Server {
  id: string;
  name: string;
  imageUrl: string;
  inviteCode: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  members: Member[];
}

interface InvitePageProps {
  params: {
    inviteCode: string;
  };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();
  if (!params.inviteCode) return notFound();

  const server: Server | null = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
    },
    include: {
      members: {
        where: {
          leftAt: null,
        },
        include: {
          user: true,
        },
      },
    },
  });
  if (!server) return notFound();

  const alreadyJoined = server.members.find(
    (member: Member) => member.userId === profile.id
  );

  if (alreadyJoined) return redirect(`/servers/${server.id}`);

  return <JoinServerModal server={server} />;
}
