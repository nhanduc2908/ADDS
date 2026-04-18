import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const [{ redirect }, { getServerSession }] = await Promise.all([
    import("next/navigation"),
    import("@/lib/server-session")
  ]);

  const user = await getServerSession();

  if (!user) {
    redirect("/login");
  }

  return <DashboardClient user={user as { id: number; email: string; name: string; role: string }} />;
}
