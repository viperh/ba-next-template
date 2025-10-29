"use client";

import { useState } from "react";
import {
  Table,
  Badge,
  Button,
  Dialog,
  Flex,
  TextField,
  Text,
  Card,
  Select,
  TextArea,
} from "@radix-ui/themes";
import {
  createRole,
  updateRole,
  deleteRole,
  assignPermissionToRole,
  removePermissionFromRole,
  getAllPermissions,
} from "@/lib/admin-actions";
import { useRouter } from "next/navigation";

interface Permission {
  id: string;
  code: string;
  description: string | null;
}

interface Role {
  id: string;
  name: string;
  description: string | null;
  parentRole: {
    id: string;
    name: string;
  } | null;
  permissions: Permission[];
  userCount: number;
  createdAt: Date;
}

export default function RolesTable({ roles }: { roles: Role[] }) {
  const router = useRouter();
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [newRoleParentId, setNewRoleParentId] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [allPermissions, setAllPermissions] = useState<any[]>([]);
  const [selectedPermissionId, setSelectedPermissionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateRole = async () => {
    setLoading(true);
    setError("");
    try {
      await createRole(
        newRoleName,
        newRoleDescription || null,
        newRoleParentId || null
      );
      setNewRoleName("");
      setNewRoleDescription("");
      setNewRoleParentId("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    setLoading(true);
    setError("");
    try {
      await deleteRole(roleId);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPermissionDialog = async (role: Role) => {
    setSelectedRole(role);
    setError("");
    setLoading(true);
    try {
      const permissions = await getAllPermissions();
      setAllPermissions(permissions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPermission = async () => {
    if (!selectedRole || !selectedPermissionId) return;

    setLoading(true);
    setError("");
    try {
      await assignPermissionToRole(selectedRole.id, selectedPermissionId);
      router.refresh();
      setSelectedPermissionId("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePermission = async (permissionId: string) => {
    if (!selectedRole) return;

    setLoading(true);
    setError("");
    try {
      await removePermissionFromRole(selectedRole.id, permissionId);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const availablePermissions = allPermissions.filter(
    (permission) =>
      !selectedRole?.permissions.some((p) => p.id === permission.id)
  );

  return (
    <Flex direction="column" gap="4">
      {/* Create New Role */}
      <Card style={{ background: "#232326", padding: "20px" }}>
        <Text
          size="3"
          weight="bold"
          style={{ marginBottom: "12px", display: "block" }}
        >
          Create New Role
        </Text>
        {error && (
          <Text size="2" style={{ color: "#ff4d4f", marginBottom: "12px" }}>
            {error}
          </Text>
        )}
        <Flex gap="3" align="end">
          <div style={{ flex: 1 }}>
            <Text size="2" style={{ marginBottom: "4px", display: "block" }}>
              Role Name
            </Text>
            <TextField.Root
              placeholder="e.g., moderator"
              value={newRoleName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewRoleName(e.target.value)
              }
            />
          </div>
          <div style={{ flex: 2 }}>
            <Text size="2" style={{ marginBottom: "4px", display: "block" }}>
              Description
            </Text>
            <TextField.Root
              placeholder="Optional description"
              value={newRoleDescription}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewRoleDescription(e.target.value)
              }
            />
          </div>
          <div style={{ flex: 1 }}>
            <Text size="2" style={{ marginBottom: "4px", display: "block" }}>
              Parent Role
            </Text>
            <Select.Root
              value={newRoleParentId}
              onValueChange={setNewRoleParentId}
            >
              <Select.Trigger placeholder="None" />
              <Select.Content>
                <Select.Item value="">None</Select.Item>
                {roles.map((role) => (
                  <Select.Item key={role.id} value={role.id}>
                    {role.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
          <Button onClick={handleCreateRole} disabled={!newRoleName || loading}>
            Create Role
          </Button>
        </Flex>
      </Card>

      {/* Roles Table */}
      <Card style={{ background: "#232326", padding: "0", overflow: "hidden" }}>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Parent Role</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Permissions</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Users</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {roles.map((role) => (
              <Table.Row key={role.id}>
                <Table.Cell>
                  <Text weight="medium">{role.name}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2" style={{ color: "#aaa" }}>
                    {role.description || "—"}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  {role.parentRole ? (
                    <Badge color="violet">{role.parentRole.name}</Badge>
                  ) : (
                    <Text size="2" style={{ color: "#666" }}>
                      None
                    </Text>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Text size="2">{role.permissions.length}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2">{role.userCount}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Flex gap="2">
                    <Dialog.Root>
                      <Dialog.Trigger>
                        <Button
                          size="1"
                          variant="soft"
                          onClick={() => handleOpenPermissionDialog(role)}
                        >
                          Permissions
                        </Button>
                      </Dialog.Trigger>
                      <Dialog.Content style={{ maxWidth: 500 }}>
                        <Dialog.Title>
                          Manage Permissions for {selectedRole?.name}
                        </Dialog.Title>

                        {error && (
                          <Text
                            size="2"
                            style={{ color: "#ff4d4f", marginBottom: "12px" }}
                          >
                            {error}
                          </Text>
                        )}

                        <Flex
                          direction="column"
                          gap="4"
                          style={{ marginTop: "16px" }}
                        >
                          <div>
                            <Text
                              size="2"
                              weight="bold"
                              style={{ marginBottom: "8px", display: "block" }}
                            >
                              Current Permissions
                            </Text>
                            {selectedRole?.permissions.length ? (
                              <Flex direction="column" gap="2">
                                {selectedRole.permissions.map((permission) => (
                                  <Flex
                                    key={permission.id}
                                    justify="between"
                                    align="center"
                                  >
                                    <Text
                                      size="2"
                                      style={{ fontFamily: "monospace" }}
                                    >
                                      {permission.code}
                                    </Text>
                                    <Button
                                      size="1"
                                      variant="soft"
                                      color="red"
                                      onClick={() =>
                                        handleRemovePermission(permission.id)
                                      }
                                      disabled={loading}
                                    >
                                      Remove
                                    </Button>
                                  </Flex>
                                ))}
                              </Flex>
                            ) : (
                              <Text size="2" style={{ color: "#666" }}>
                                No permissions assigned
                              </Text>
                            )}
                          </div>

                          <div>
                            <Text
                              size="2"
                              weight="bold"
                              style={{ marginBottom: "8px", display: "block" }}
                            >
                              Assign New Permission
                            </Text>
                            <Flex gap="2">
                              <Select.Root
                                value={selectedPermissionId}
                                onValueChange={setSelectedPermissionId}
                                disabled={
                                  loading || availablePermissions.length === 0
                                }
                              >
                                <Select.Trigger
                                  placeholder="Select a permission"
                                  style={{ flex: 1 }}
                                />
                                <Select.Content>
                                  {availablePermissions.map((permission) => (
                                    <Select.Item
                                      key={permission.id}
                                      value={permission.id}
                                    >
                                      {permission.code}
                                    </Select.Item>
                                  ))}
                                </Select.Content>
                              </Select.Root>
                              <Button
                                onClick={handleAssignPermission}
                                disabled={!selectedPermissionId || loading}
                              >
                                Assign
                              </Button>
                            </Flex>
                          </div>
                        </Flex>

                        <Flex gap="3" mt="4" justify="end">
                          <Dialog.Close>
                            <Button variant="soft" color="gray">
                              Close
                            </Button>
                          </Dialog.Close>
                        </Flex>
                      </Dialog.Content>
                    </Dialog.Root>

                    <Button
                      size="1"
                      variant="soft"
                      color="red"
                      onClick={() => handleDeleteRole(role.id)}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    </Flex>
  );
}
