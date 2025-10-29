"use client";

import { useState } from "react";
import {
  Table,
  Badge,
  Button,
  Dialog,
  Flex,
  Select,
  Text,
  Card,
} from "@radix-ui/themes";
import {
  assignRoleToUser,
  removeRoleFromUser,
  getAllRoles,
} from "@/lib/admin-actions";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  roles: Array<{
    id: string;
    name: string;
    description: string | null;
  }>;
}

interface Role {
  id: string;
  name: string;
  description: string | null;
}

export default function UsersTable({ users }: { users: User[] }) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpenDialog = async (user: User) => {
    setSelectedUser(user);
    setError("");
    setLoading(true);
    try {
      const allRoles = await getAllRoles();
      setRoles(allRoles as any);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRoleId) return;

    setLoading(true);
    setError("");
    try {
      await assignRoleToUser(selectedUser.id, selectedRoleId);
      router.refresh();
      setSelectedRoleId("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    if (!selectedUser) return;

    setLoading(true);
    setError("");
    try {
      await removeRoleFromUser(selectedUser.id, roleId);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const availableRoles = roles.filter(
    (role) => !selectedUser?.roles.some((ur) => ur.id === role.id)
  );

  return (
    <>
      <Card style={{ background: "#232326", padding: "0", overflow: "hidden" }}>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Roles</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Verified</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.map((user) => (
              <Table.Row key={user.id}>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  <Flex gap="2" wrap="wrap">
                    {user.roles.length > 0 ? (
                      user.roles.map((role) => (
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
                  {user.emailVerified ? (
                    <Badge color="green">Yes</Badge>
                  ) : (
                    <Badge color="gray">No</Badge>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Dialog.Root>
                    <Dialog.Trigger>
                      <Button
                        size="1"
                        variant="soft"
                        onClick={() => handleOpenDialog(user)}
                      >
                        Manage Roles
                      </Button>
                    </Dialog.Trigger>
                    <Dialog.Content style={{ maxWidth: 500 }}>
                      <Dialog.Title>
                        Manage Roles for {selectedUser?.name}
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
                            Current Roles
                          </Text>
                          {selectedUser?.roles.length ? (
                            <Flex direction="column" gap="2">
                              {selectedUser.roles.map((role) => (
                                <Flex
                                  key={role.id}
                                  justify="between"
                                  align="center"
                                >
                                  <Badge color="iris">{role.name}</Badge>
                                  <Button
                                    size="1"
                                    variant="soft"
                                    color="red"
                                    onClick={() => handleRemoveRole(role.id)}
                                    disabled={loading}
                                  >
                                    Remove
                                  </Button>
                                </Flex>
                              ))}
                            </Flex>
                          ) : (
                            <Text size="2" style={{ color: "#666" }}>
                              No roles assigned
                            </Text>
                          )}
                        </div>

                        <div>
                          <Text
                            size="2"
                            weight="bold"
                            style={{ marginBottom: "8px", display: "block" }}
                          >
                            Assign New Role
                          </Text>
                          <Flex gap="2">
                            <Select.Root
                              value={selectedRoleId}
                              onValueChange={setSelectedRoleId}
                              disabled={loading || availableRoles.length === 0}
                            >
                              <Select.Trigger
                                placeholder="Select a role"
                                style={{ flex: 1 }}
                              />
                              <Select.Content>
                                {availableRoles.map((role) => (
                                  <Select.Item key={role.id} value={role.id}>
                                    {role.name}
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select.Root>
                            <Button
                              onClick={handleAssignRole}
                              disabled={!selectedRoleId || loading}
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
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    </>
  );
}
