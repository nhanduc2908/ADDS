import { redirect } from "next/navigation";
import TeamClient from "./TeamClient";

export default async function TeamPage() {
  const [{ getServerSession }] = await Promise.all([
    import("@/lib/server-session")
  ]);

  const user = await getServerSession();

  if (!user || user.role !== "manager") {
    redirect("/login");
  }

  return <TeamClient user={user} />;
}