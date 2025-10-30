"use server";


import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {hasPermission} from "@/lib/access";
import {prisma} from "@/lib/db";

/**
 * Get current user from session
 */
async function getCurrentUser() {
	const session = await auth.api.getSession({headers: await headers()});
	if (!session?.user) {
		throw new Error("Unauthorized");
	}
	return session.user;
}

/**
 * Check if current user has required permission
 */
async function requirePermission(permissionCode: string) {
	const user = await getCurrentUser();
	const hasAccess = await hasPermission(user.id, permissionCode);
	if (!hasAccess) {
		throw new Error(`Permission denied: ${permissionCode} required`);
	}
	return user;
}

// ==================== USER MANAGEMENT ====================

export async function getAllUsers() {
	await requirePermission("manage_users");
	
	const users = await prisma.user.findMany({
		include: {
			UserRole: {
				include: {
					role: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});
	
	return users.map((user) => ({
		id: user.id,
		name: user.name,
		email: user.email,
		emailVerified: user.emailVerified,
		createdAt: user.createdAt,
		roles: user.UserRole.map((ur) => ur.role),
	}));
}

export async function assignRoleToUser(userId: string, roleId: string) {
	await requirePermission("manage_users");
	
	// Check if role exists
	const role = await prisma.role.findUnique({where: {id: roleId}});
	if (!role) {
		throw new Error("Role not found");
	}
	
	// Check if user exists
	const user = await prisma.user.findUnique({where: {id: userId}});
	if (!user) {
		throw new Error("User not found");
	}
	
	// Check if already assigned
	const existing = await prisma.userRole.findUnique({
		where: {
			userId_roleId: {
				userId,
				roleId,
			},
		},
	});
	
	if (existing) {
		throw new Error("User already has this role");
	}
	
	const currentUser = await getCurrentUser();
	
	await prisma.userRole.create({
		data: {
			userId,
			roleId,
			assignedById: currentUser.id,
		},
	});
	
	return {success: true};
}

export async function removeRoleFromUser(userId: string, roleId: string) {
	await requirePermission("manage_users");
	
	await prisma.userRole.delete({
		where: {
			userId_roleId: {
				userId,
				roleId,
			},
		},
	});
	
	return {success: true};
}

// ==================== ROLE MANAGEMENT ====================

export async function getAllRoles() {
	await requirePermission("manage_roles");
	
	const roles = await prisma.role.findMany({
		include: {
			permissions: {
				include: {
					permission: true,
				},
			},
			parentRole: true,
			_count: {
				select: {
					users: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});
	
	return roles.map((role) => ({
		id: role.id,
		name: role.name,
		description: role.description,
		parentRole: role.parentRole,
		permissions: role.permissions.map((rp) => rp.permission),
		userCount: role._count.users,
		createdAt: role.createdAt,
	}));
}

export async function createRole(
	name: string,
	description: string | null,
	parentRoleId: string | null
) {
	await requirePermission("manage_roles");
	
	// Check if role name already exists
	const existing = await prisma.role.findUnique({where: {name}});
	if (existing) {
		throw new Error("Role with this name already exists");
	}
	
	// If parentRoleId is provided, verify it exists
	if (parentRoleId) {
		const parentRole = await prisma.role.findUnique({
			where: {id: parentRoleId},
		});
		if (!parentRole) {
			throw new Error("Parent role not found");
		}
	}
	
	const role = await prisma.role.create({
		data: {
			name,
			description,
			parentRoleId,
		},
	});
	
	return role;
}

export async function updateRole(
	roleId: string,
	data: {
		name?: string;
		description?: string | null;
		parentRoleId?: string | null;
	}
) {
	await requirePermission("manage_roles");
	
	// If updating name, check for duplicates
	if (data.name) {
		const existing = await prisma.role.findFirst({
			where: {
				name: data.name,
				NOT: {id: roleId},
			},
		});
		if (existing) {
			throw new Error("Role with this name already exists");
		}
	}
	
	// If updating parent role, verify it exists
	if (data.parentRoleId) {
		const parentRole = await prisma.role.findUnique({
			where: {id: data.parentRoleId},
		});
		if (!parentRole) {
			throw new Error("Parent role not found");
		}
		
		// Prevent circular hierarchy
		if (data.parentRoleId === roleId) {
			throw new Error("A role cannot be its own parent");
		}
	}
	
	const role = await prisma.role.update({
		where: {id: roleId},
		data,
	});
	
	return role;
}

export async function deleteRole(roleId: string) {
	await requirePermission("manage_roles");
	
	// Check if role has users
	const userCount = await prisma.userRole.count({
		where: {roleId},
	});
	
	if (userCount > 0) {
		throw new Error("Cannot delete role with assigned users");
	}
	
	await prisma.role.delete({
		where: {id: roleId},
	});
	
	return {success: true};
}

// ==================== PERMISSION MANAGEMENT ====================

export async function getAllPermissions() {
	await requirePermission("manage_permissions");
	
	const permissions = await prisma.permission.findMany({
		include: {
			roles: {
				include: {
					role: true,
				},
			},
		},
		orderBy: {
			code: "asc",
		},
	});
	
	return permissions.map((permission) => ({
		id: permission.id,
		code: permission.code,
		description: permission.description,
		roles: permission.roles.map((rp) => rp.role),
		createdAt: permission.createdAt,
	}));
}

export async function createPermission(
	code: string,
	description: string | null
) {
	await requirePermission("manage_permissions");
	
	// Check if permission code already exists
	const existing = await prisma.permission.findUnique({where: {code}});
	if (existing) {
		throw new Error("Permission with this code already exists");
	}
	
	const permission = await prisma.permission.create({
		data: {
			code,
			description,
		},
	});
	
	return permission;
}

export async function deletePermission(permissionId: string) {
	await requirePermission("manage_permissions");
	
	await prisma.permission.delete({
		where: {id: permissionId},
	});
	
	return {success: true};
}

export async function assignPermissionToRole(
	roleId: string,
	permissionId: string
) {
	await requirePermission("manage_permissions");
	
	// Check if already assigned
	const existing = await prisma.rolePermission.findUnique({
		where: {
			roleId_permissionId: {
				roleId,
				permissionId,
			},
		},
	});
	
	if (existing) {
		throw new Error("Role already has this permission");
	}
	
	await prisma.rolePermission.create({
		data: {
			roleId,
			permissionId,
		},
	});
	
	return {success: true};
}

export async function removePermissionFromRole(
	roleId: string,
	permissionId: string
) {
	await requirePermission("manage_permissions");
	
	await prisma.rolePermission.delete({
		where: {
			roleId_permissionId: {
				roleId,
				permissionId,
			},
		},
	});
	
	return {success: true};
}
