import {prisma} from "@/lib/db"

async function main() {
	console.log("🌱 Starting database seed...");
	
	// Create default permissions
	console.log("Creating permissions...");
	const permissions = await Promise.all([
		prisma.permission.upsert({
			where: {code: "manage_users"},
			update: {},
			create: {
				code: "manage_users",
				description: "Manage users and assign roles",
			},
		}),
		prisma.permission.upsert({
			where: {code: "manage_roles"},
			update: {},
			create: {
				code: "manage_roles",
				description: "Manage roles and role hierarchy",
			},
		}),
		prisma.permission.upsert({
			where: {code: "manage_permissions"},
			update: {},
			create: {
				code: "manage_permissions",
				description: "Manage permissions and assignments",
			},
		}),
		prisma.permission.upsert({
			where: {code: "view_dashboard"},
			update: {},
			create: {
				code: "view_dashboard",
				description: "Access to dashboard",
			},
		}),
	]);
	console.log(`✅ Created ${permissions.length} permissions`);
	
	// Create default roles
	console.log("Creating roles...");
	const adminRole = await prisma.role.upsert({
		where: {name: "admin"},
		update: {},
		create: {
			name: "admin",
			description: "Administrator with full system access",
		},
	});
	
	const userRole = await prisma.role.upsert({
		where: {name: "user"},
		update: {},
		create: {
			name: "user",
			description: "Standard user with basic access",
		},
	});
	
	const moderatorRole = await prisma.role.upsert({
		where: {name: "moderator"},
		update: {},
		create: {
			name: "moderator",
			description: "Moderator with elevated permissions",
			parentRoleId: userRole.id, // Inherits user permissions
		},
	});
	
	console.log("✅ Created 3 roles");
	
	// Assign permissions to admin role
	console.log("Assigning permissions to admin role...");
	const manageUsersPermission = permissions.find(
		(p) => p.code === "manage_users"
	)!;
	const manageRolesPermission = permissions.find(
		(p) => p.code === "manage_roles"
	)!;
	const managePermissionsPermission = permissions.find(
		(p) => p.code === "manage_permissions"
	)!;
	const viewDashboardPermission = permissions.find(
		(p) => p.code === "view_dashboard"
	)!;
	
	await Promise.all([
		prisma.rolePermission.upsert({
			where: {
				roleId_permissionId: {
					roleId: adminRole.id,
					permissionId: manageUsersPermission.id,
				},
			},
			update: {},
			create: {
				roleId: adminRole.id,
				permissionId: manageUsersPermission.id,
			},
		}),
		prisma.rolePermission.upsert({
			where: {
				roleId_permissionId: {
					roleId: adminRole.id,
					permissionId: manageRolesPermission.id,
				},
			},
			update: {},
			create: {
				roleId: adminRole.id,
				permissionId: manageRolesPermission.id,
			},
		}),
		prisma.rolePermission.upsert({
			where: {
				roleId_permissionId: {
					roleId: adminRole.id,
					permissionId: managePermissionsPermission.id,
				},
			},
			update: {},
			create: {
				roleId: adminRole.id,
				permissionId: managePermissionsPermission.id,
			},
		}),
		prisma.rolePermission.upsert({
			where: {
				roleId_permissionId: {
					roleId: adminRole.id,
					permissionId: viewDashboardPermission.id,
				},
			},
			update: {},
			create: {
				roleId: adminRole.id,
				permissionId: viewDashboardPermission.id,
			},
		}),
	]);
	
	// Assign basic permissions to user role
	await prisma.rolePermission.upsert({
		where: {
			roleId_permissionId: {
				roleId: userRole.id,
				permissionId: viewDashboardPermission.id,
			},
		},
		update: {},
		create: {
			roleId: userRole.id,
			permissionId: viewDashboardPermission.id,
		},
	});
	
	console.log("✅ Assigned permissions to roles");
	
	console.log("\n🎉 Database seeded successfully!");
	console.log("\n📝 Next steps:");
	console.log(
		"1. Create your first admin user by registering at http://localhost:3000"
	);
	console.log(
		"2. Manually assign the admin role to your user in the database:"
	);
	console.log("   - Find your user ID from the 'user' table");
	console.log(
		`   - Run: INSERT INTO "UserRole" ("userId", "roleId") VALUES ('YOUR_USER_ID', '${adminRole.id}');`
	);
	console.log("\nOr use this SQL query after registration:");
	console.log(`
        INSERT INTO "UserRole" ("userId", "roleId", "assignedAt")
        SELECT id, '${adminRole.id}', NOW()
        FROM "user"
        WHERE email = 'your-email@example.com' ON CONFLICT DO NOTHING;
	`);
}

main()
	.catch((e) => {
		console.error("❌ Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
