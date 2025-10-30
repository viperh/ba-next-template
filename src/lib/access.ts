import {prisma} from "@/lib/db";

/**
 * Get all permissions for a user, including inherited permissions from role hierarchy
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
	// Get all roles for the user
	const userRoles = await prisma.userRole.findMany({
		where: {userId},
		include: {
			role: {
				include: {
					permissions: {
						include: {
							permission: true,
						},
					},
				},
			},
		},
	});
	
	const permissionCodes = new Set<string>();
	
	// For each role, get permissions including from parent roles
	for (const userRole of userRoles) {
		const rolePermissions = await getRolePermissionsWithHierarchy(
			userRole.role.id
		);
		rolePermissions.forEach((code) => permissionCodes.add(code));
	}
	
	return Array.from(permissionCodes);
}

/**
 * Get all permissions for a role, including inherited from parent roles
 */
async function getRolePermissionsWithHierarchy(
	roleId: string,
	visited = new Set<string>()
): Promise<string[]> {
	// Prevent infinite loops
	if (visited.has(roleId)) {
		return [];
	}
	visited.add(roleId);
	
	const role = await prisma.role.findUnique({
		where: {id: roleId},
		include: {
			permissions: {
				include: {
					permission: true,
				},
			},
			parentRole: true,
		},
	});
	
	if (!role) {
		return [];
	}
	
	// Get direct permissions
	const directPermissions = role.permissions.map((rp) => rp.permission.code);
	
	// Get parent role permissions recursively
	const parentPermissions = role.parentRoleId
		? await getRolePermissionsWithHierarchy(role.parentRoleId, visited)
		: [];
	
	return [...directPermissions, ...parentPermissions];
}

/**
 * Check if a user has a specific permission
 */
export async function hasPermission(
	userId: string,
	permissionCode: string
): Promise<boolean> {
	const permissions = await getUserPermissions(userId);
	return permissions.includes(permissionCode);
}

/**
 * Check if a user has a specific role
 */
export async function hasRole(
	userId: string,
	roleName: string
): Promise<boolean> {
	const userRole = await prisma.userRole.findFirst({
		where: {
			userId,
			role: {
				name: roleName,
			},
		},
	});
	
	return userRole !== null;
}

/**
 * Check if a user has all required permissions
 */
export async function checkAccess(
	userId: string,
	requiredPermissions: string[]
): Promise<boolean> {
	if (requiredPermissions.length === 0) {
		return true;
	}
	
	const userPermissions = await getUserPermissions(userId);
	return requiredPermissions.every((permission) =>
		userPermissions.includes(permission)
	);
}

/**
 * Check if a user has any of the required permissions
 */
export async function checkAnyAccess(
	userId: string,
	requiredPermissions: string[]
): Promise<boolean> {
	if (requiredPermissions.length === 0) {
		return true;
	}
	
	const userPermissions = await getUserPermissions(userId);
	return requiredPermissions.some((permission) =>
		userPermissions.includes(permission)
	);
}

/**
 * Get all roles for a user
 */
export async function getUserRoles(userId: string) {
	const userRoles = await prisma.userRole.findMany({
		where: {userId},
		include: {
			role: true,
		},
	});
	
	return userRoles.map((ur) => ur.role);
}
