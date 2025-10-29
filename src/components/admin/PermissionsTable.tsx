"use client";

import { useState } from "react";
import {
  Table,
  Badge,
  Button,
  Flex,
  TextField,
  Text,
  Card,
} from "@radix-ui/themes";
import { createPermission, deletePermission } from "@/lib/admin-actions";
import { useRouter } from "next/navigation";

interface Permission {
  id: string;
  code: string;
  description: string | null;
  roles: Array<{
    id: string;
    name: string;
  }>;
  createdAt: Date;
}

export default function PermissionsTable({
  permissions,
}: {
  permissions: Permission[];
}) {
  const router = useRouter();
  const [newPermissionCode, setNewPermissionCode] = useState("");
  const [newPermissionDescription, setNewPermissionDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreatePermission = async () => {
    setLoading(true);
    setError("");
    try {
      await createPermission(
        newPermissionCode,
        newPermissionDescription || null
      );
      setNewPermissionCode("");
      setNewPermissionDescription("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePermission = async (permissionId: string) => {
    if (!confirm("Are you sure you want to delete this permission?")) return;

    setLoading(true);
    setError("");
    try {
      await deletePermission(permissionId);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex direction="column" gap="4">
      {/* Create New Permission */}
      <Card style={{ background: "#232326", padding: "20px" }}>
        <Text
          size="3"
          weight="bold"
          style={{ marginBottom: "12px", display: "block" }}
        >
          Create New Permission
        </Text>
        {error && (
          <Text size="2" style={{ color: "#ff4d4f", marginBottom: "12px" }}>
            {error}
          </Text>
        )}
        <Flex gap="3" align="end">
          <div style={{ flex: 1 }}>
            <Text size="2" style={{ marginBottom: "4px", display: "block" }}>
              Permission Code
            </Text>
            <TextField.Root
              placeholder="e.g., manage_users"
              value={newPermissionCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPermissionCode(e.target.value)
              }
            />
          </div>
          <div style={{ flex: 2 }}>
            <Text size="2" style={{ marginBottom: "4px", display: "block" }}>
              Description
            </Text>
            <TextField.Root
              placeholder="Optional description"
              value={newPermissionDescription}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPermissionDescription(e.target.value)
              }
            />
          </div>
          <Button
            onClick={handleCreatePermission}
            disabled={!newPermissionCode || loading}
          >
            Create Permission
          </Button>
        </Flex>
      </Card>

      {/* Permissions Table */}
      <Card style={{ background: "#232326", padding: "0", overflow: "hidden" }}>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Code</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Assigned to Roles</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {permissions.map((permission) => (
              <Table.Row key={permission.id}>
                <Table.Cell>
                  <Text weight="medium" style={{ fontFamily: "monospace" }}>
                    {permission.code}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2" style={{ color: "#aaa" }}>
                    {permission.description || "—"}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Flex gap="2" wrap="wrap">
                    {permission.roles.length > 0 ? (
                      permission.roles.map((role) => (
                        <Badge key={role.id} color="iris">
                          {role.name}
                        </Badge>
                      ))
                    ) : (
                      <Text size="2" style={{ color: "#666" }}>
                        No roles
                      </Text>
                    )}
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    size="1"
                    variant="soft"
                    color="red"
                    onClick={() => handleDeletePermission(permission.id)}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    </Flex>
  );
}
