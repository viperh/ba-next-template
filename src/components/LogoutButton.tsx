"use client";

import { Button } from "@radix-ui/themes";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <Button variant="soft" onClick={handleLogout}>
      Logout
    </Button>
  );
}

