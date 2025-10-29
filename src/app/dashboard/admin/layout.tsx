import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Box, Flex, Tabs } from "@radix-ui/themes";
import Link from "next/link";
import { hasPermission } from "@/lib/access";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/");
  }

  // Check if user has any admin permissions
  const canManageUsers = await hasPermission(session.user.id, "manage_users");
  const canManageRoles = await hasPermission(session.user.id, "manage_roles");
  const canManagePermissions = await hasPermission(session.user.id, "manage_permissions");

  if (!canManageUsers && !canManageRoles && !canManagePermissions) {
    redirect("/dashboard");
  }

  return (
    <Flex direction="column" gap="6">
      <Box>
        <Tabs.Root defaultValue="users">
          <Tabs.List>
            {canManageUsers && (
              <Link href="/dashboard/admin/users" style={{ textDecoration: "none" }}>
                <Tabs.Trigger value="users">Users</Tabs.Trigger>
              </Link>
            )}
            {canManageRoles && (
              <Link href="/dashboard/admin/roles" style={{ textDecoration: "none" }}>
                <Tabs.Trigger value="roles">Roles</Tabs.Trigger>
              </Link>
            )}
            {canManagePermissions && (
              <Link href="/dashboard/admin/permissions" style={{ textDecoration: "none" }}>
                <Tabs.Trigger value="permissions">Permissions</Tabs.Trigger>
              </Link>
            )}
          </Tabs.List>
        </Tabs.Root>
      </Box>

      {children}
    </Flex>
  );
}

