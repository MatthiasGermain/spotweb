import { requireUser, isAdmin, isTresorier } from "@/lib/ndf/auth";
import Nav from "@/components/ndf/Nav";

export default async function NdfAppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const displayName = user.prenom.trim() !== "" ? user.prenom.trim() : user.username;

  return (
    <>
      <Nav displayName={displayName} isAdmin={isAdmin(user)} isTresorier={isTresorier(user)} />
      {children}
    </>
  );
}
