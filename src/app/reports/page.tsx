import { redirect } from "next/navigation";
import ReportsClient from "./ReportsClient";

export default async function ReportsPage() {
  const [{ getServerSession }] = await Promise.all([
    import("@/lib/server-session")
  ]);

  const user = await getServerSession();

  if (!user) {
    redirect("/login");
  }

  return <ReportsClient user={user} />;
}
