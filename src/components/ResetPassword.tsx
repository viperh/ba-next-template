"use client";
import {
  Button,
  Card,
  Flex,
  Heading,
  Skeleton,
  TextField,
} from "@radix-ui/themes";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const ResetPassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await authClient.forgetPassword({
        email,
        redirectTo: "/reset-password",
      });
      setMessage(
        "If this email is registered, you will receive a password reset link."
      );
      setEmail("");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{ minHeight: "100vh", background: "#18181b" }}
    >
      <Skeleton loading={loading}>
        <Card
          style={{
            width: 400,
            padding: 32,
            borderRadius: 16,
            background: "#232326",
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          }}
        >
          <Heading size="4" style={{ marginBottom: 16, textAlign: "center" }}>
            Reset Password
          </Heading>
          <TextField.Root
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && (
            <div
              style={{
                color: "#ff4d4f",
                marginBottom: 8,
                textAlign: "center",
                marginTop: "10px",
              }}
            >
              {error}
            </div>
          )}
          {message && (
            <div
              style={{
                color: "#52c41a",
                marginBottom: 8,
                textAlign: "center",
                marginTop: "10px",
              }}
            >
              {message}
            </div>
          )}
          <Button
            style={{ marginTop: 16, width: "100%" }}
            onClick={handleResetPassword}
          >
            Reset Password
          </Button>
        </Card>
      </Skeleton>
    </Flex>
  );
};

export default ResetPassword;
