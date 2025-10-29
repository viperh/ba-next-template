import { Heading } from "@radix-ui/themes";
import { getAllUsers } from "@/lib/admin-actions";
import UsersTable from "@/components/admin/UsersTable";

export default async function UsersPage() {
  const users = await getAllUsers();

  return (
    <div>
      <Heading size="6" style={{ marginBottom: "24px" }}>
        User Management
      </Heading>
      <UsersTable users={users} />
    </div>
  );
}

