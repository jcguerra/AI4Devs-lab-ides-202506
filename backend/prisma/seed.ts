import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear usuario administrador por defecto
  const defaultUser = await prisma.user.upsert({
    where: { email: 'admin@ats.com' },
    update: {},
    create: {
      email: 'admin@ats.com',
      name: 'Administrador ATS',
      role: 'ADMIN'
    }
  });

  console.log('✅ Usuario administrador creado:', defaultUser);

  // Crear usuario reclutador por defecto
  const defaultRecruiter = await prisma.user.upsert({
    where: { email: 'recruiter@ats.com' },
    update: {},
    create: {
      email: 'recruiter@ats.com',
      name: 'Reclutador ATS',
      role: 'RECRUITER'
    }
  });

  console.log('✅ Usuario reclutador creado:', defaultRecruiter);

  console.log('🎉 Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 