const { AdminRole, PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function upsertAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@agripulse.rw';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin already present: ${email}`);
    return existing;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await prisma.adminUser.create({
    data: {
      email,
      passwordHash,
      fullName: 'System Admin',
      role: AdminRole.SYSTEM_ADMIN,
    },
  });
  console.log(`Seeded SYSTEM_ADMIN: ${email}`);
  return admin;
}

async function upsertCrop(name, nameRw) {
  return prisma.crop.upsert({
    where: { name },
    update: { nameRw, isActive: true },
    create: { name, nameRw, unit: 'kg', isActive: true },
  });
}

async function upsertMarket(name, region) {
  return prisma.market.upsert({
    where: { name },
    update: { region, isActive: true },
    create: { name, region, isActive: true },
  });
}

async function ensureCropMarket(cropId, marketId) {
  const existing = await prisma.cropMarket.findUnique({
    where: { cropId_marketId: { cropId, marketId } },
  });
  if (existing) {
    if (!existing.isActive) {
      return prisma.cropMarket.update({
        where: { id: existing.id },
        data: { isActive: true },
      });
    }
    return existing;
  }
  return prisma.cropMarket.create({ data: { cropId, marketId } });
}

async function seedDemoCatalog(adminId) {
  const maize = await upsertCrop('Maize', 'Ibigori');
  const beans = await upsertCrop('Beans', 'Ibishyimbo');
  const potato = await upsertCrop('Irish Potato', 'Ibirayi');
  const cassava = await upsertCrop('Cassava', 'Imyumbati');

  const kigali = await upsertMarket('Kigali Central', 'Kigali City');
  const nyabugogo = await upsertMarket('Nyabugogo', 'Kigali City');
  const musanze = await upsertMarket('Musanze', 'Northern Province');
  const huye = await upsertMarket('Huye Market', 'Southern Province');

  const pairs = [
    [maize.id, kigali.id],
    [maize.id, nyabugogo.id],
    [beans.id, nyabugogo.id],
    [beans.id, musanze.id],
    [potato.id, musanze.id],
    [potato.id, kigali.id],
    [cassava.id, huye.id],
    [cassava.id, musanze.id],
  ];

  for (const [cropId, marketId] of pairs) {
    await ensureCropMarket(cropId, marketId);
  }

  const priceCount = await prisma.dailyPrice.count();
  if (priceCount === 0) {
    const now = new Date();
    const samples = [
      { cropId: maize.id, marketId: kigali.id, price: 750 },
      { cropId: beans.id, marketId: nyabugogo.id, price: 1100 },
      { cropId: potato.id, marketId: musanze.id, price: 520 },
      { cropId: cassava.id, marketId: huye.id, price: 450 },
      { cropId: maize.id, marketId: nyabugogo.id, price: 730 },
    ];

    for (const sample of samples) {
      await prisma.dailyPrice.create({
        data: {
          ...sample,
          recordedAt: now,
          createdById: adminId,
        },
      });
    }
    console.log(`Seeded ${samples.length} demo daily prices`);
  } else {
    console.log(`Prices already present (${priceCount}) — skipped price seed`);
  }

  const sessionCount = await prisma.ussdSession.count();
  if (sessionCount === 0) {
    const days = 7;
    for (let i = 0; i < days; i++) {
      const startedAt = new Date();
      startedAt.setDate(startedAt.getDate() - (days - 1 - i));
      startedAt.setHours(9 + i, 15, 0, 0);
      await prisma.ussdSession.create({
        data: {
          sessionId: `seed-session-${i + 1}`,
          phoneHash: `seed-hash-${i + 1}`,
          language: i % 2 === 0 ? 'rw' : 'en',
          currentMenu: 'root',
          startedAt,
          endedAt: new Date(startedAt.getTime() + 60_000),
          status: 'completed',
        },
      });
    }
    console.log('Seeded 7 demo USSD sessions');
  }

  const queryCount = await prisma.cropQueryLog.count();
  if (queryCount === 0) {
    const crops = [maize, beans, potato, cassava];
    for (let i = 0; i < 20; i++) {
      const crop = crops[i % crops.length];
      await prisma.cropQueryLog.create({
        data: {
          cropId: crop.id,
          source: i % 3 === 0 ? 'ussd_ai' : 'ussd_prices',
        },
      });
    }
    console.log('Seeded demo crop query logs');
  }

  console.log('Demo catalog ready (crops, markets, links)');
}

async function main() {
  const admin = await upsertAdmin();
  await seedDemoCatalog(admin.id);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
