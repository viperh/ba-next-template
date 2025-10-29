import { Heading } from "@radix-ui/themes";
import { getAllPermissions } from "@/lib/admin-actions";
import PermissionsTable from "@/components/admin/PermissionsTable";

export default async function PermissionsPage() {
  const permissions = await getAllPermissions();

  return (
    <div>
      <Heading size="6" style={{ marginBottom: "24px" }}>
        Permission Management
      </Heading>
      <PermissionsTable permissions={permissions} />
    </div>
  );
}
