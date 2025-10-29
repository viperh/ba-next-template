import { Heading } from "@radix-ui/themes";
import { getAllRoles } from "@/lib/admin-actions";
import RolesTable from "@/components/admin/RolesTable";

export default async function RolesPage() {
  const roles = await getAllRoles();

  return (
    <div>
      <Heading size="6" style={{ marginBottom: "24px" }}>
        Role Management
      </Heading>
      <RolesTable roles={roles} />
    </div>
  );
}
