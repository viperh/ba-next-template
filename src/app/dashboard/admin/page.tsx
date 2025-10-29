import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/access";

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/");
  }

  // Redirect to the first available admin section
  const canManageUsers = await hasPermission(session.user.id, "manage_users");
  const canManageRoles = await hasPermission(session.user.id, "manage_roles");
  const canManagePermissions = await hasPermission(session.user.id, "manage_permissions");

  if (canManageUsers) {
    redirect("/dashboard/admin/users");
  } else if (canManageRoles) {
    redirect("/dashboard/admin/roles");
  } else if (canManagePermissions) {
    redirect("/dashboard/admin/permissions");
  }

  redirect("/dashboard");
}

