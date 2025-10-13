// lib/session-context.tsx
"use client";

import { createContext, useContext } from "react";
import { auth } from "@/lib/auth";

export type SessionType = Awaited<
	ReturnType<typeof auth.api.getSession>
>;

const SessionContext = createContext<SessionType>(null);

export function SessionProvider({
									value,
									children,
								}: {
	value: SessionType;
	children: React.ReactNode;
}) {
	return (
		<SessionContext.Provider value={value}>{children}</SessionContext.Provider>
	);
}

export function useSession() {
	return useContext(SessionContext);
}
