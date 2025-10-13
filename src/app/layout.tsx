import './globals.css';
import "@radix-ui/themes/styles.css";
import {Flex, Theme} from "@radix-ui/themes";
import {SessionProvider} from "@/lib/session-context";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

	const session = await auth.api.getSession({headers: await headers()})

  return (
    <html>
      <body>
	  <Theme accentColor="iris" grayColor="sand" appearance="dark">
		  <SessionProvider value={session}>
			  <Flex direction="column" width="100vw" height="100vh" justify="center" align="center" style={{ background: "#18181b" }}>
				  {children}
			  </Flex>
		  </SessionProvider>
	  </Theme>
      </body>
    </html>
  );
}
