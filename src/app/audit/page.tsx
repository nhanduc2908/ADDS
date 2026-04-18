import { redirect } from "next/navigation";
import AuditClient from "./AuditClient";

export default async function AuditPage() {
  const [{ getServerSession }] = await Promise.all([
    import("@/lib/server-session")
  ]);

  const user = await getServerSession();

  if (!user) {
    redirect("/login");
  }

  return <AuditClient user={user} />;
}