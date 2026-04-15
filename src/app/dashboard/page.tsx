import DashboardClient from "./DashboardClient";

export default function DashboardPage() {
  return <DashboardClient user={{ id: 1, email: "demo@security.vn", name: "Demo User", role: "user" }} />;
}
