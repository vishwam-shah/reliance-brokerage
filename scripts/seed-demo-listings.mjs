import { readFileSync } from 'fs';
import mongoose from 'mongoose';

try {
  const env = readFileSync(new URL('../.env', import.meta.url), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
} catch {}

const { MONGODB_URI } = process.env;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set');
  process.exit(1);
}

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function fmtRM(millions) {
  if (millions >= 1000) return `RM ${(millions / 1000).toFixed(millions % 1000 === 0 ? 0 : 2)}B`;
  if (millions >= 1) return `RM ${Number.isInteger(millions) ? millions : millions.toFixed(2)}M`;
  return `RM ${(millions * 1000).toFixed(0)}K`;
}

const DEMO_LISTINGS = [
  {
    title: 'Profitable Specialty Coffee Café in Bangsar',
    sector: 'F&B / Restaurant',
    location: 'Bangsar, Kuala Lumpur',
    valuationNum: 1.2,
    revenueNum: 0.85,
    rentPrice: 'RM 8,500/mo',
    availableFor: ['buy'],
    featured: true,
    description:
      'Established 6-year specialty coffee café in the heart of Bangsar with a loyal customer base of 800+ regulars and consistent foot traffic. Fully equipped with La Marzocco espresso machine, in-house roastery, and a 35-seat dine-in area.\n\nIncluded in the sale:\n• Full equipment and FF&E (valued at RM 280K)\n• Lease assignment until 2028 (with renewal option)\n• Trained staff of 7 willing to stay\n• POS, social media accounts (12K Instagram followers), recipes\n\nReason for sale: Owner relocating overseas. Books and financials available under NDA.',
    images: ['https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200&q=80&auto=format&fit=crop'],
  },
  {
    title: 'Established Hardware & Tools Retail Chain (3 outlets)',
    sector: 'Retail',
    location: 'Petaling Jaya, Selangor',
    valuationNum: 4.5,
    revenueNum: 6.2,
    rentPrice: '',
    availableFor: ['buy'],
    featured: true,
    description:
      'Profitable hardware and industrial tools retail business operating across 3 strategically located outlets in PJ. 18 years in operation with B2B contracts servicing 40+ contractors and SMEs.\n\nKey highlights:\n• EBITDA margin: 14%\n• Recurring B2B revenue: 65% of sales\n• 22 trained staff\n• Inventory worth RM 1.8M included\n• Long-standing supplier relationships with credit terms\n\nGreat opportunity for strategic acquirer or experienced retail operator looking to expand.',
    images: ['https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=1200&q=80&auto=format&fit=crop'],
  },
  {
    title: 'Modern Dental Clinic with 4 Treatment Rooms',
    sector: 'Healthcare',
    location: 'Mont Kiara, Kuala Lumpur',
    valuationNum: 2.8,
    revenueNum: 1.9,
    rentPrice: '',
    availableFor: ['buy'],
    featured: false,
    description:
      'Premium dental clinic in upscale Mont Kiara serving expat and high-income local patients. Equipped with digital X-ray, intraoral scanners, and modern aesthetic equipment.\n\n• 4 fully equipped treatment rooms\n• 1 senior dentist + 2 associates + 5 support staff\n• 1,800+ active patient base\n• Insurance panels with major providers\n• 12-year lease with 5 years remaining\n\nOwner-dentist transitioning to teaching role; willing to provide 6-month handover support.',
    images: ['https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=80&auto=format&fit=crop'],
  },
  {
    title: 'Boutique Beauty & Skincare Spa',
    sector: 'Beauty / Wellness',
    location: 'Damansara Heights, KL',
    valuationNum: 0.65,
    revenueNum: 0.78,
    rentPrice: 'RM 6,200/mo',
    availableFor: ['buy', 'rent'],
    featured: false,
    description:
      'Award-winning beauty and skincare spa with 5 treatment rooms, established membership base of 320 active members, and exclusive distribution rights for two European skincare brands in the area.\n\n• 8 trained therapists (LCMC and CIDESCO certified)\n• 70% returning customer rate\n• Online booking system & CRM\n• Available for full sale or as rental for an experienced operator',
    images: ['https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80&auto=format&fit=crop'],
  },
  {
    title: 'Logistics & Last-Mile Delivery Company',
    sector: 'Logistics / Transport',
    location: 'Shah Alam, Selangor',
    valuationNum: 8.5,
    revenueNum: 14.0,
    rentPrice: '',
    availableFor: ['buy'],
    featured: true,
    description:
      'Established last-mile delivery operation servicing major e-commerce platforms across Klang Valley and Negeri Sembilan. 32-vehicle fleet (mix of vans and motorcycles) with 6 sorting hubs.\n\n• Long-term contracts with 4 major marketplaces\n• Average 12,000 deliveries/day\n• 95.4% on-time delivery rate\n• 110 full-time staff + 80 contractors\n• Fleet, telematics, and routing software included\n\nIdeal for strategic buyer in e-commerce, retail or 3PL space.',
    images: ['https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1200&q=80&auto=format&fit=crop'],
  },
  {
    title: 'Halal-Certified Bakery & Pastry Production',
    sector: 'Manufacturing',
    location: 'Klang, Selangor',
    valuationNum: 3.2,
    revenueNum: 4.8,
    rentPrice: '',
    availableFor: ['buy'],
    featured: false,
    description:
      'JAKIM-certified halal bakery supplying premium pastries and breads to 90+ cafés, hotels and supermarket chains. 12,000 sqft production facility with HACCP certification.\n\n• Daily output: 8,000+ units\n• Established 11 years\n• 28 production staff\n• 6 delivery vans\n• Recurring B2B revenue: 88%\n• HACCP, GMP, MeSTI compliant',
    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80&auto=format&fit=crop'],
  },
  {
    title: 'After-School Tuition Centre Franchise (5 branches)',
    sector: 'Education',
    location: 'Cheras, Kuala Lumpur',
    valuationNum: 1.8,
    revenueNum: 2.4,
    rentPrice: '',
    availableFor: ['buy'],
    featured: false,
    description:
      'Profitable after-school tuition centre operating across 5 branches in Klang Valley. Specializes in Math, Science and English for primary and secondary students.\n\n• 1,200+ enrolled students\n• 38 part-time and full-time tutors\n• Proprietary curriculum and assessment system\n• Strong reputation with 4.8★ Google rating across all branches\n• Owner willing to stay on consultancy basis for 12 months',
    images: ['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80&auto=format&fit=crop'],
  },
  {
    title: 'Standalone Shop Lot for Rent — Subang',
    sector: 'Property / Real Estate',
    location: 'Subang Jaya, Selangor',
    valuationNum: 0,
    revenueNum: 0,
    rentPrice: 'RM 12,000/mo',
    availableFor: ['rent'],
    featured: false,
    description:
      'Prime corner shop lot in busy Subang commercial area. 3-storey, 4,200 sqft total floor area with rear loading access and 6 dedicated parking bays.\n\n• Suitable for F&B, clinic, retail, or office\n• Heavy foot traffic (residential + office buildings nearby)\n• Recently renovated\n• Minimum 2-year lease\n• Available immediately',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop'],
  },
  {
    title: 'SaaS Platform — Restaurant Reservation System',
    sector: 'Technology',
    location: 'Cyberjaya, Selangor',
    valuationNum: 5.5,
    revenueNum: 1.4,
    rentPrice: '',
    availableFor: ['buy'],
    featured: true,
    description:
      'Profitable B2B SaaS serving 380+ restaurants across Malaysia, Singapore, and Indonesia. Subscription-based reservation, table management and customer CRM platform.\n\n• MRR: RM 116K (growing 4% MoM)\n• Net revenue retention: 108%\n• Churn: 2.1%/month\n• 8-person team (devs, support, sales)\n• Tech stack: Next.js, Postgres, AWS\n• Source code, IP, brand and customer base included',
    images: ['https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80&auto=format&fit=crop'],
  },
  {
    title: 'Organic Vegetable Farm — Cameron Highlands',
    sector: 'Agriculture',
    location: 'Cameron Highlands, Pahang',
    valuationNum: 2.1,
    revenueNum: 1.6,
    rentPrice: '',
    availableFor: ['buy'],
    featured: false,
    description:
      'Certified organic vegetable farm operating on 4 acres of leasehold land in Cameron Highlands. Direct-supply contracts with 3 supermarket chains and a meal-kit company.\n\n• MyOrganic certified since 2019\n• 12 polytunnels + open field cultivation\n• Established irrigation and packing house\n• 18 farm workers (including foreman)\n• Land lease: 22 years remaining\n• Stable monthly revenue with 12-week forward orders',
    images: ['https://images.unsplash.com/photo-1500076656116-558758c991c1?w=1200&q=80&auto=format&fit=crop'],
  },
  {
    title: 'Auto Service Centre & Workshop',
    sector: 'Services',
    location: 'Puchong, Selangor',
    valuationNum: 1.6,
    revenueNum: 2.1,
    rentPrice: '',
    availableFor: ['buy'],
    featured: false,
    description:
      'Established 14-year auto service centre serving 4,000+ regular customers. Specialised in Japanese and continental brands. Authorized service partner for 2 insurance panels.\n\n• 8 service bays + 2 alignment bays\n• 12 mechanics (3 senior, foreman included)\n• Diagnostic and ECU programming equipment\n• Recurring monthly customer visits: 600+\n• Lease: 6 years remaining',
    images: ['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&q=80&auto=format&fit=crop'],
  },
  {
    title: 'Fashion Boutique with E-commerce Operations',
    sector: 'Retail',
    location: 'Bukit Bintang, KL',
    valuationNum: 0.45,
    revenueNum: 0.9,
    rentPrice: 'RM 9,800/mo',
    availableFor: ['buy', 'rent'],
    featured: false,
    description:
      'Trendy women\'s fashion boutique with retail storefront and active e-commerce business. 3 years established with strong social media following (45K Instagram, 28K TikTok).\n\n• Retail location: 850 sqft prime mall corner\n• E-commerce: Shopify store + Shopee/Lazada presence\n• Inventory worth RM 180K included\n• 4 sales staff + 2 ecommerce assistants\n• Suitable for full sale or rental of physical store with brand transfer',
    images: ['https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&q=80&auto=format&fit=crop'],
  },
];

await mongoose.connect(MONGODB_URI);

const users = mongoose.connection.collection('users');
const listings = mongoose.connection.collection('listings');

// Find an admin/superadmin to attribute the listings to
const admin = await users.findOne({ role: { $in: ['admin', 'superadmin'] } });
if (!admin) {
  console.error('No admin/superadmin user found. Run the superadmin seed first.');
  await mongoose.disconnect();
  process.exit(1);
}

console.log(`Using ${admin.email} (${admin.role}) as createdBy for demo listings`);

let inserted = 0;
let skipped = 0;
const now = new Date();

for (const item of DEMO_LISTINGS) {
  const slug = `${slugify(item.title)}-demo`;
  const existing = await listings.findOne({ slug });
  if (existing) {
    skipped++;
    continue;
  }

  await listings.insertOne({
    title: item.title,
    slug,
    sector: item.sector,
    location: item.location,
    valuation: item.valuationNum > 0 ? fmtRM(item.valuationNum) : '',
    valuationNum: item.valuationNum,
    revenue: item.revenueNum > 0 ? fmtRM(item.revenueNum) : '',
    revenueNum: item.revenueNum,
    rentPrice: item.rentPrice,
    availableFor: item.availableFor,
    status: 'active',
    description: item.description,
    images: item.images,
    featured: item.featured,
    views: Math.floor(Math.random() * 400) + 50,
    rejectionReason: '',
    createdBy: admin._id,
    approvedBy: admin._id,
    approvedAt: now,
    createdAt: new Date(now.getTime() - Math.floor(Math.random() * 30) * 86400 * 1000),
    updatedAt: now,
  });
  inserted++;
}

console.log(`\nDone. Inserted: ${inserted}, Skipped (already exists): ${skipped}`);
await mongoose.disconnect();
