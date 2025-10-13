"use client";
import {Button, Card, Flex, Heading, Skeleton, TextField} from "@radix-ui/themes"
import {useState} from "react";


const ResetPassword = () => {
	
	const [loading, setLoading] = useState<boolean>(false);
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	
	
	const handleResetPassword = async () => {
		setLoading(true);
		
		setTimeout(() => {
			setLoading(false);
		}, 3000);
		setEmail("");
		setError("If this email is registered, you will receive a password reset link.");
	}
	
	return (
		<Flex
			direction="column"
			align="center"
			justify="center"
			style={{minHeight: "100vh", background: "#18181b"}}>
			<Skeleton loading={loading}>
				<Card
					style={{
						width: 400,
						padding: 32,
						borderRadius: 16,
						background: "#232326",
						boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
					}}>
					<Heading size="4" style={{marginBottom: 16, textAlign: "center"}}>
						Reset Password
					</Heading>
					<TextField.Root placeholder="Email" type="email"
									onChange={(e) => setEmail(e.target.value)}/>
					
					{error && (<div style={{
						color: "#ff4d4f",
						marginBottom: 8,
						textAlign: "center",
						marginTop: "10px"
					}}>{error}</div>)}
					<Button style={{marginTop: 16, width: "100%"}} onClick={handleResetPassword}>
						Reset Password
					</Button>
				
				</Card>
			</Skeleton>
		</Flex>
	
	)
	
}

export default ResetPassword;