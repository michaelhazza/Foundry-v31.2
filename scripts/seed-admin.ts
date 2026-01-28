import { db } from '../server/db';
import { organizations, users } from '../server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

async function seedAdminUser() {
  console.log('Seeding admin user...');

  try {
    const [existingOrg] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, 'default'))
      .limit(1);

    let orgId: number;

    if (existingOrg) {
      console.log('[OK] Default organization exists (id:', existingOrg.id, ')');
      orgId = existingOrg.id;
    } else {
      const [newOrg] = await db
        .insert(organizations)
        .values({
          name: 'Default Organization',
          slug: 'default',
        })
        .returning();

      console.log('[OK] Created default organization (id:', newOrg.id, ')');
      orgId = newOrg.id;
    }

    const [existingAdmin] = await db
      .select()
      .from(users)
      .where(eq(users.email, 'admin@foundry.local'))
      .limit(1);

    if (existingAdmin) {
      console.log('[OK] Admin user already exists (id:', existingAdmin.id, ')');
      return;
    }

    const passwordHash = await bcrypt.hash('admin123', 10);

    const [adminUser] = await db
      .insert(users)
      .values({
        organizationId: orgId,
        email: 'admin@foundry.local',
        passwordHash: passwordHash,
        name: 'Admin User',
        role: 'admin',
      })
      .returning();

    console.log('[OK] Created admin user (id:', adminUser.id, ')');
    console.log('Email:    admin@foundry.local');
    console.log('Password: admin123');
    console.log('IMPORTANT: Change this password after first login!');

  } catch (error) {
    console.error('[X] Seed error:', error);
    throw error;
  }
}

seedAdminUser()
  .then(() => {
    console.log('[OK] Seed complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('[X] Seed failed:', error);
    process.exit(1);
  });
