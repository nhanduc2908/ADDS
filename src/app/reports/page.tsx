import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ReportsClient from "./ReportsClient";

export default async function ReportsPage() {
  const user = await getSession();
  
  if (!user) {
    redirect("/login");
  }

  return <ReportsClient user={user} />;
}
