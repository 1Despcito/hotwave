import { prisma } from './src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Updating admin password...');
  const newPassword = '01018429139Aa';
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const existingUser = await prisma.user.findFirst({
    where: { email: 'ahmed@hotwavetour.com' }
  });

  if (!existingUser) {
    console.log('Admin user (ahmed@hotwavetour.com) not found in the database. You can navigate to /api/setup to create it.');
    return;
  }

  await prisma.user.update({
    where: { email: 'ahmed@hotwavetour.com' },
    data: { password: hashedPassword },
  });

  console.log('Password updated successfully for user "ahmed@hotwavetour.com"!');
}

main()
  .catch(e => console.error('Error updating password:', e))
  .finally(async () => {
    await prisma.$disconnect();
  });
