import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const user = await getSession();
  
  if (!user) {
    redirect("/login");
  }

  return <SettingsClient user={user} />;
}
