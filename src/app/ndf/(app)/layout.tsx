import { requireUser, isAdmin, isTresorier } from "@/lib/ndf/auth";
import Nav from "@/components/ndf/Nav";

export default async function NdfAppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <>
      <Nav username={user.username} isAdmin={isAdmin(user)} isTresorier={isTresorier(user)} />
      {children}
    </>
  );
}
