import Department from '../models/Department';
import User from '../models/User';

export async function seedDefaults(): Promise<void> {
  // Seed departments
  await Department.createDefaultDepartments();

  // Seed admin user if provided
  const adminPhone = process.env.ADMIN_PHONE;
  const adminName = process.env.ADMIN_NAME || 'Administrator';
  if (adminPhone) {
    let admin = await User.findOne({ phone: adminPhone });
    if (!admin) {
      admin = new User({ phone: adminPhone, name: adminName, role: 'admin', isVerified: true });
      await admin.save();
      // eslint-disable-next-line no-console
      console.log(`Seeded admin user ${adminPhone}`);
    }
  }
}


