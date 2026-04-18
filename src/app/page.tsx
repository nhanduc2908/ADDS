export default async function HomePage() {
  const [{ redirect }, { getServerSession }] = await Promise.all([
    import("next/navigation"),
    import("@/lib/server-session")
  ]);

  const user = await getServerSession();

  // Redirect to dashboard if already logged in
  if (user) {
    redirect("/dashboard");
  }

  // Show login page if not logged in
  redirect("/login");
}
