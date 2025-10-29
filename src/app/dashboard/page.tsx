import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, Flex, Heading, Text, Box, Badge } from "@radix-ui/themes";
import { getUserRoles, getUserPermissions } from "@/lib/access";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    return null;
  }

  const roles = await getUserRoles(session.user.id);
  const permissions = await getUserPermissions(session.user.id);

  return (
    <Flex direction="column" gap="6">
      <Heading size="8">Welcome, {session.user.name}!</Heading>

      <Flex gap="4" wrap="wrap">
        {/* User Info Card */}
        <Card
          style={{
            flex: "1 1 300px",
            background: "#232326",
            padding: "24px",
          }}
        >
          <Heading size="4" style={{ marginBottom: "16px" }}>
            Profile Information
          </Heading>
          <Flex direction="column" gap="3">
            <Box>
              <Text size="2" style={{ color: "#aaa" }}>
                Email
              </Text>
              <Text size="3" weight="medium">
                {session.user.email}
              </Text>
            </Box>
            <Box>
              <Text size="2" style={{ color: "#aaa" }}>
                User ID
              </Text>
              <Text size="2" style={{ fontFamily: "monospace", color: "#888" }}>
                {session.user.id}
              </Text>
            </Box>
          </Flex>
        </Card>

        {/* Roles Card */}
        <Card
          style={{
            flex: "1 1 300px",
            background: "#232326",
            padding: "24px",
          }}
        >
          <Heading size="4" style={{ marginBottom: "16px" }}>
            Your Roles
          </Heading>
          {roles.length > 0 ? (
            <Flex gap="2" wrap="wrap">
              {roles.map((role) => (
                <Badge key={role.id} size="2" color="iris">
                  {role.name}
                </Badge>
              ))}
            </Flex>
          ) : (
            <Text style={{ color: "#aaa" }}>No roles assigned</Text>
          )}
        </Card>

        {/* Permissions Card */}
        <Card
          style={{
            flex: "1 1 300px",
            background: "#232326",
            padding: "24px",
          }}
        >
          <Heading size="4" style={{ marginBottom: "16px" }}>
            Your Permissions
          </Heading>
          {permissions.length > 0 ? (
            <Flex direction="column" gap="1">
              {permissions.slice(0, 8).map((permission) => (
                <Text key={permission} size="2" style={{ color: "#aaa" }}>
                  • {permission}
                </Text>
              ))}
              {permissions.length > 8 && (
                <Text size="2" style={{ color: "#666", marginTop: "4px" }}>
                  +{permissions.length - 8} more
                </Text>
              )}
            </Flex>
          ) : (
            <Text style={{ color: "#aaa" }}>No permissions</Text>
          )}
        </Card>
      </Flex>
    </Flex>
  );
}

