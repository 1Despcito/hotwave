import { prisma } from './src/lib/prisma';

async function main() {
  console.log('Starting Database Update...');

  // The broken URLs
  const broken1 = '1583936542993';
  const broken2 = '1553198031';
  
  // Working fallbacks
  const fix1 = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1000'; // Sea Trips
  const fix2 = 'https://images.unsplash.com/photo-1548574505-12caf0050b5b?auto=format&fit=crop&q=80&w=1000'; // Safari
  const fix3 = 'https://images.unsplash.com/photo-1534142491173-0975608bfa79?auto=format&fit=crop&q=80&w=1000'; // Horseback

  // Update Services
  const services = await prisma.service.findMany();
  for (const s of services) {
    if (s.imageUrl && (s.imageUrl.includes(broken1) || s.imageUrl.includes(broken2))) {
      const fixedUrl = s.title.toLowerCase().includes('safari') ? fix2 : (s.title.toLowerCase().includes('horse') ? fix3 : fix1);
      await prisma.service.update({
        where: { id: s.id },
        data: { imageUrl: fixedUrl }
      });
      console.log(`Updated Service image for: ${s.title}`);
    }
  }

  // Update Service Types
  const types = await prisma.serviceType.findMany();
  for (const t of types) {
    if (t.imageUrl && (t.imageUrl.includes(broken1) || t.imageUrl.includes(broken2))) {
      await prisma.serviceType.update({
        where: { id: t.id },
        data: { imageUrl: fix1 }
      });
      console.log(`Updated ServiceType image for: ${t.name}`);
    }
  }

  // Update Site Settings
  const settings = await prisma.siteSettings.findMany();
  for (const s of settings) {
    if (s.heroImageUrl && (s.heroImageUrl.includes(broken1) || s.heroImageUrl.includes(broken2))) {
      await prisma.siteSettings.update({
        where: { id: s.id },
        data: { heroImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2070' }
      });
      console.log(`Updated SiteSettings hero image`);
    }
  }

  // --- SEED DEFAULT SERVICES ---
  // The user asked to add some packages ("ضيف كذا صنف") to test Admin and DB
  const existingCount = await prisma.service.count();
  if (existingCount === 0) {
    console.log('No services found in DB. Seeding defaults...');
    
    // Create Sea Trips
    const seaTrips = await prisma.service.create({
      data: {
        title: 'الرحلات البحرية', titleEn: 'Sea Trips',
        description: 'استكشف الشعاب المرجانية النابضة بالحياة، اسبح مع الدلافين، واسترخ على جزر خلابة في البحر الأحمر.',
        descriptionEn: 'Explore the vibrant coral reefs, swim with dolphins, and relax on pristine islands.',
        imageUrl: fix1,
      }
    });

    await prisma.serviceType.createMany({
      data: [
        { serviceId: seaTrips.id, name: 'جزيرة أورانج باي', nameEn: 'Orange Bay', price: 35, duration: '8 Hours', durationEn: '8 Hours', includes: 'الغداء, أدوات السنوركلنج, المشروبات', includesEn: 'Lunch, Snorkeling Gear, Drinks' },
        { serviceId: seaTrips.id, name: 'جزيرة بارادايس', nameEn: 'Paradise Island', price: 40, duration: '8 Hours', durationEn: '8 Hours', includes: 'الغداء, أدوات السنوركلنج, المشروبات, عرض فني', includesEn: 'Lunch, Snorkeling Gear, Drinks, Show' },
        { serviceId: seaTrips.id, name: 'تجربة الغوص', nameEn: 'Diving Experience', price: 50, duration: '6 Hours', durationEn: '6 Hours', includes: 'مدرب, أدوات الغوص, غطستين', includesEn: 'Instructor, Diving Gear, 2 Dives' },
      ]
    });

    // Create Safari
    const safari = await prisma.service.create({
      data: {
        title: 'رحلات السفاري', titleEn: 'Safari Adventures',
        description: 'انطلق في مغامرات السفاري بالبيتش باجي، قم بزيارة القرى البدوية، وشاهد أجمل غروب للشمس في الصحراء.',
        descriptionEn: 'Conquer the desert dunes on a quad bike, visit Bedouin villages, and watch the sunset.',
        imageUrl: fix2,
      }
    });

    await prisma.serviceType.createMany({
      data: [
        { serviceId: safari.id, name: 'بيتش باجي', nameEn: 'Quad Biking', price: 25, duration: '3 Hours', durationEn: '3 Hours', includes: 'مرشد, شاي بدوي, توصيل', includesEn: 'Guide, Bedouin Tea, Transfer' },
        { serviceId: safari.id, name: 'عشاء بدوي', nameEn: 'Bedouin Dinner', price: 45, duration: '5 Hours', durationEn: '5 Hours', includes: 'عشاء, عرض شرقي, مراقبة النجوم', includesEn: 'Dinner, Oriental Show, Stargazing' },
      ]
    });

    // Create Horseback
    const horses = await prisma.service.create({
      data: {
        title: 'ركوب الخيل', titleEn: 'Horseback Riding',
        description: 'استمتع بركوب الخيل على شاطئ البحر أو عبر المسارات الصحراوية، مناسب لجميع مستويات الخبرة.',
        descriptionEn: 'Ride along the beach or through the desert trails, suitable for all experience levels.',
        imageUrl: fix3,
      }
    });

    await prisma.serviceType.createMany({
      data: [
        { serviceId: horses.id, name: 'ركوب على الشاطئ', nameEn: 'Beach Ride', price: 30, duration: '2 Hours', durationEn: '2 Hours', includes: 'مدرب محترف, خوذة', includesEn: 'Professional Trainer, Helmet' },
      ]
    });

    console.log('Seeded defaults successfully!');
  }

  console.log('Finished updating DB.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
