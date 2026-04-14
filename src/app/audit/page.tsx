import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AuditClient from "./AuditClient";

export default async function AuditPage() {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  return <AuditClient user={user} />;
}