import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Box, Container, Flex, Button, Text, Separator } from "@radix-ui/themes";
import Link from "next/link";
import { hasPermission } from "@/lib/access";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/");
  }

  // Check if user has admin permissions
  const canManageUsers = await hasPermission(session.user.id, "manage_users");
  const canManageRoles = await hasPermission(session.user.id, "manage_roles");
  const canManagePermissions = await hasPermission(session.user.id, "manage_permissions");
  const isAdmin = canManageUsers || canManageRoles || canManagePermissions;

  return (
    <Flex direction="column" style={{ minHeight: "100vh", background: "#18181b" }}>
      {/* Navigation */}
      <Box
        style={{
          background: "#232326",
          borderBottom: "1px solid #333",
          padding: "16px 0",
        }}
      >
        <Container size="4">
          <Flex justify="between" align="center">
            <Flex gap="6" align="center">
              <Link href="/dashboard" style={{ textDecoration: "none" }}>
                <Text size="5" weight="bold" style={{ color: "#fff" }}>
                  Dashboard
                </Text>
              </Link>
              <Separator orientation="vertical" />
              <Link href="/dashboard" style={{ textDecoration: "none" }}>
                <Text style={{ color: "#aaa" }}>Home</Text>
              </Link>
              {isAdmin && (
                <>
                  <Link href="/dashboard/admin" style={{ textDecoration: "none" }}>
                    <Text style={{ color: "#aaa" }}>Admin</Text>
                  </Link>
                </>
              )}
            </Flex>
            <Flex gap="4" align="center">
              <Text style={{ color: "#aaa" }}>{session.user.name}</Text>
              <LogoutButton />
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Box style={{ flex: 1 }}>
        <Container size="4" style={{ paddingTop: "32px", paddingBottom: "32px" }}>
          {children}
        </Container>
      </Box>
    </Flex>
  );
}

