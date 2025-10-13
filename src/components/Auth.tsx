"use client";

import {useState} from "react";
import {Button, Card, Flex, Heading, SegmentedControl, Skeleton, TextField} from "@radix-ui/themes";
import {signIn, signUp} from "@/lib/auth-client";
import {useRouter} from "next/navigation";
import Link from "next/link";

const Auth = () => {
	const [active, setActive] = useState<"login" | "register">("login");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();
	
	const handleSignIn = async () => {
		setLoading(true);
		setError("");
		try {
			const {error: signInError} = await signIn.email({
				email,
				password,
				callbackURL: "/dashboard",
				rememberMe: true,
			});
			if (signInError) {
				setError(signInError.message || "Login failed");
			} else {
				router.push("/dashboard");
			}
		} catch (e: any) {
			setError(e.message || "Login failed");
		} finally {
			setLoading(false);
		}
	};
	
	const handleSignUp = async () => {
		setLoading(true);
		setError("");
		try {
			const {error: signUpError} = await signUp.email({
				email,
				password,
				name: username,
				callbackURL: "/dashboard",
			});
			if (signUpError) {
				setError(signUpError.message || "Registration failed");
			} else {
				router.push("/dashboard");
			}
		} catch (e: any) {
			setError(e.message || "Registration failed");
		} finally {
			setLoading(false);
		}
	};
	
	return (
		<Flex
			direction="column"
			align="center"
			justify="center"
			style={{minHeight: "100vh", background: "#18181b"}}
		>
			<Skeleton loading={loading}>
				<SegmentedControl.Root
					value={active}
					onValueChange={(value) => setActive(value as "login" | "register")}
					style={{marginBottom: 32}}
				>
					<SegmentedControl.Item value="login">Login</SegmentedControl.Item>
					<SegmentedControl.Item value="register">Register</SegmentedControl.Item>
				</SegmentedControl.Root>
				
				<Flex gap="4">
					{active === "login" && (
						<Card
							style={{
								width: 400,
								padding: 32,
								borderRadius: 16,
								background: "#232326",
								boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
							}}
						>
							<Heading size="4" style={{marginBottom: 16, textAlign: "center"}}>
								Login
							</Heading>
							<Flex direction="column" gap="3">
								<TextField.Root placeholder="Email" type="email"
												onChange={(e) => setEmail(e.target.value)}/>
								<TextField.Root placeholder="Password" type="password"
												onChange={(e) => setPassword(e.target.value)}/>
								{error && (
									<div style={{color: "#ff4d4f", marginBottom: 8, textAlign: "center"}}>{error}</div>
								)}
								<Button style={{marginTop: 16, width: "100%"}} onClick={handleSignIn}>
									Login
								</Button>
								<Link href={"/resetPassword"} style={{
									marginTop: 12,
									textAlign: "center",
									color: "#7c3aed",
									textDecoration: "underline",
									fontSize: 14,
								}}>Forgot Password?</Link>
							</Flex>
						</Card>
					)}
					
					{active === "register" && (
						<Card
							style={{
								width: 400,
								padding: 32,
								borderRadius: 16,
								background: "#232326",
								boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
							}}
						>
							<Heading size="4" style={{marginBottom: 16, textAlign: "center"}}>
								Register
							</Heading>
							<Flex direction="column" gap="3">
								<TextField.Root placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
								<TextField.Root placeholder="Email" type="email"
												onChange={(e) => setEmail(e.target.value)}/>
								<TextField.Root placeholder="Password" type="password"
												onChange={(e) => setPassword(e.target.value)}/>
								{error && (
									<div style={{color: "#ff4d4f", marginBottom: 8, textAlign: "center"}}>{error}</div>
								)}
								<Button style={{marginTop: 16, width: "100%"}} onClick={handleSignUp}>
									Register
								</Button>
							</Flex>
						</Card>
					)}
				</Flex>
			</Skeleton>
		</Flex>
	);
};

export default Auth;