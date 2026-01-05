import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";

export const metadata = {
  title: "Admin panel | Phure Studios",
};

export default function AdminDashboardPage() {
  const token = cookies().get("admin_token")?.value;
  if (!token || token !== process.env.ADMIN_TOKEN) {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}
