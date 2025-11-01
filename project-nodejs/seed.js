const mongoose = require('mongoose');
const Permission = require('./models/Permission');
const Role = require('./models/Role');
const Admin = require('./models/Admin');
const Department = require('./models/Department');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connection successful'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

async function seedDatabase() {
  try {
    console.log('🌱 Starting to create sample data...');

    // 1. Create basic permissions
    const permissions = [
      { name: 'View', description: 'View data permission' },
      { name: 'Edit', description: 'Edit data permission' },
      { name: 'Delete', description: 'Delete data permission' },
      { name: 'Update', description: 'Update data permission' },
      { name: 'Show', description: 'Show data permission' },
      { name: 'Create', description: 'Create new data permission' }
    ];
    console.log('📝 Creating permissions...');
    const createdPermissions = [];
    for (const perm of permissions) {
      const existingPerm = await Permission.findOne({ name: perm.name });
      if (!existingPerm) {
        const newPerm = await Permission.create(perm);
        createdPermissions.push(newPerm);
        console.log(`✅ Created permission: ${perm.name}`);
      } else {
        createdPermissions.push(existingPerm);
        console.log(`⏭️ Permission already exists: ${perm.name}`);
      }
    }

    // 2. Create roles
    console.log('👥 Creating roles...');
    const roles = [
      {
        name: 'superadmin',
        description: 'Super Administrator - Full access',
        hierarchy: 3,
        permissions: createdPermissions.map(p => p._id)
      },
      {
        name: 'vipadmin',
        description: 'VIP Administrator - High level access',
        hierarchy: 2,
        permissions: createdPermissions.slice(0, 4).map(p => p._id) // View, Edit, Delete, Update
      },
      {
        name: 'admin',
        description: 'Administrator - Standard access',
        hierarchy: 1,
        permissions: createdPermissions.slice(0, 2).map(p => p._id) // View, Edit only
      }
    ];
    const createdRoles = [];
    for (const roleData of roles) {
      const existingRole = await Role.findOne({ name: roleData.name });
      if (!existingRole) {
        const newRole = await Role.create(roleData);
        createdRoles.push(newRole);
        console.log(`✅ Created role: ${roleData.name}`);
      } else {
        createdRoles.push(existingRole);
        console.log(`⏭️ Role already exists: ${roleData.name}`);
      }
    }

        // 3. Create departments
    console.log('🏢 Creating departments...');
    const departments = ['IT Department', 'HR Department', 'Finance Department'];
    const createdDepartments = [];

    for (const deptName of departments) {
      let department = await Department.findOne({ name: deptName });
      if (!department) {
        department = await Department.create({
          name: deptName,
          adminIds: [],
          userIds: []
        });
        console.log(`✅ Created department: ${deptName}`);
      } else {
        console.log(`⏭️ Department already exists: ${deptName}`);
      }
      createdDepartments.push(department);
    }

    // 4. Create admins with roles
    console.log('👨‍💼 Creating admins with roles...');
    const AdminService = require('./services/AdminService');
    const admins = [
      {
        username: 'superadmin',
        email: 'superadmin@example.com',
        password: 'super123',
        fullName: 'Super Admin',
        role: createdRoles.find(r => r.name === 'superadmin')._id,
        department: createdDepartments[0]._id, // IT Department
        permissions: createdPermissions.map(p => p._id)
      },
      {
        username: 'vipadmin',
        email: 'vipadmin@example.com',
        password: 'vip123',
        fullName: 'VIP Admin',
        role: createdRoles.find(r => r.name === 'vipadmin')._id,
        department: createdDepartments[1]._id, // HR Department
        permissions: createdPermissions.slice(0, 4).map(p => p._id) // View, Edit, Delete, Update
      },
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        fullName: 'Normal Admin',
        role: createdRoles.find(r => r.name === 'admin')._id,
        department: createdDepartments[2]._id, // Finance Department
        permissions: createdPermissions.slice(0, 2).map(p => p._id) // View, Edit only
      }
    ];
    for (const adminData of admins) {
      const existingAdmin = await Admin.findOne({ email: adminData.email });
      if (!existingAdmin) {
        // Use AdminService.register to create admin with role logic
        const result = await AdminService.register({
          ...adminData,
          creatorRole: 'superadmin' // Seed data created by superadmin
        });

        if (result.success) {
          // Add admin to department
          const dept = createdDepartments.find(d => d._id.equals(adminData.department));
          if (dept && Array.isArray(dept.admins) && !dept.admins.includes(result.admin._id)) {
            dept.admins.push(result.admin._id);
            await dept.save();
          }
          console.log(`✅ Created ${adminData.username}: ${adminData.email} (password: ${adminData.password})`);
          console.log(`   🔑 Permissions: ${adminData.permissions.length} permissions`);
        } else {
          console.log(`❌ Error creating ${adminData.username} ${adminData.email}: ${result.message}`);
        }
      } else {
        console.log(`⏭️ Admin already exists: ${adminData.email}`);
      }
    }

    console.log('🎉 Sample data creation completed!');
    console.log('\n📋 Admin login information:');
    console.log('🔴 SUPERADMIN:');
    console.log('   Email: superadmin@example.com');
    console.log('   Password: super123');
    console.log('   Role: superadmin');
    console.log('   Permissions: All permissions');
    console.log('');
    console.log('🟡 VIPADMIN:');
    console.log('   Email: vipadmin@example.com');
    console.log('   Password: vip123');
    console.log('   Role: vipadmin');
    console.log('   Permissions: View, Edit, Delete, Update');
    console.log('');
    console.log('🟢 ADMIN:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
    console.log('   Role: admin');
    console.log('   Permissions: View, Edit');
    console.log('');
    console.log('🔗 API endpoints:');
    console.log('POST /api/admin/login - Admin login');
    console.log('POST /api/auth/register - User registration');
    console.log('POST /api/admin/users/:id/permissions - Assign permissions to user');

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run script
seedDatabase();