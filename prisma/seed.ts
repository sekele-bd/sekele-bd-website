import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ========== ADMIN ==========
  const email = process.env.ADMIN_EMAIL || "admin@sekele.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const hash = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, password: hash, name: "Sekele Admin" },
  });

  // ========== HERO SLIDERS ==========
  await prisma.slider.deleteMany();
  await prisma.slider.createMany({
    data: [
      {
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070",
        alt: "Newlywed couple celebrating outdoors",
        order: 0,
        isActive: true,
      },
      {
        image:
          "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2070",
        alt: "Wedding couple embracing",
        order: 1,
        isActive: true,
      },
      {
        image:
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2070",
        alt: "Wedding couple in a garden",
        order: 2,
        isActive: true,
      },
      {
        image:
          "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070",
        alt: "Couple on their wedding day",
        order: 3,
        isActive: true,
      },
    ],
  });

  // ========== OUR STORY ==========
  await prisma.siteContent.upsert({
    where: { key: "our_story" },
    update: {
      title: "Welcome to Sekele",
      content: JSON.stringify([
        "We are a creative wedding photography team from Bangladesh. Our journey began with a simple belief — every wedding has a unique soul, and it deserves to be told with honesty and heart.",
        "We focus on capturing the quiet glances, the loud laughter, the tears of joy, and the bonds that matter most. From intimate village ceremonies to grand city celebrations, we document the real story of your day.",
        "Our photographs are not just images — they become more valuable with time.",
      ]),
    },
    create: {
      key: "our_story",
      title: "Welcome to Sekele",
      content: JSON.stringify([
        "We are a creative wedding photography team from Bangladesh. Our journey began with a simple belief — every wedding has a unique soul, and it deserves to be told with honesty and heart.",
        "We focus on capturing the quiet glances, the loud laughter, the tears of joy, and the bonds that matter most. From intimate village ceremonies to grand city celebrations, we document the real story of your day.",
        "Our photographs are not just images — they become more valuable with time.",
      ]),
    },
  });

  // ========== CONTACT ==========
  await prisma.siteContent.upsert({
    where: { key: "contact" },
    update: {
      title: "Get in touch",
      content: JSON.stringify({
        address: "House no: 26/1, Road-4, Rupnagar, Mirpur-2, Dhaka",
        phone: "+8801839-659916",
        email: "hello@sekele.com",
        note: "Have a date in mind? Reach out — we would love to hear your story.",
      }),
    },
    create: {
      key: "contact",
      title: "Get in touch",
      content: JSON.stringify({
        address: "House no: 26/1, Road-4, Rupnagar, Mirpur-2, Dhaka",
        phone: "+8801839-659916",
        email: "hello@sekele.com",
        note: "Have a date in mind? Reach out — we would love to hear your story.",
      }),
    },
  });

  // ========== SOCIAL LINKS ==========
  await prisma.socialLink.deleteMany();
  await prisma.socialLink.createMany({
    data: [
      { platform: "facebook", url: "https://facebook.com/", order: 0, isActive: true },
      { platform: "instagram", url: "https://instagram.com/", order: 1, isActive: true },
      { platform: "youtube", url: "https://youtube.com/", order: 2, isActive: true },
    ],
  });

  // ========== ALBUMS ==========
  await prisma.albumImage.deleteMany();
  await prisma.album.deleteMany();

  const albumsData = [
    {
      title: "Aarib & Nuha",
      location: "Dhaka",
      date: "December 2024",
      type: "Wedding",
      description:
        "A warm, intimate wedding day in the heart of Dhaka — filled with quiet glances, family blessings, and moments that felt effortless.",
      cover:
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1600",
      slug: "aarib-nuha",
      order: 0,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200",
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200",
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200",
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200",
        "https://images.unsplash.com/photo-1507504031003-b417219a0fde?q=80&w=1200",
      ],
    },
    {
      title: "Rafi & Samira",
      location: "Sylhet",
      date: "November 2024",
      type: "Holud & Wedding",
      description:
        "Two days of colour, music and soft emotion in Sylhet — from a vibrant holud to a heartfelt wedding ceremony.",
      cover:
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600",
      slug: "rafi-samira",
      order: 1,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200",
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200",
        "https://images.unsplash.com/photo-1522673607200-164a1a3d4f5f?q=80&w=1200",
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200",
      ],
    },
    {
      title: "Imran & Lamiya",
      location: "Chittagong",
      date: "October 2024",
      type: "Wedding",
      description:
        "Soft light and real emotion by the coast — a candid celebration of love in Chittagong.",
      cover:
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1600",
      slug: "imran-lamiya",
      order: 2,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200",
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200",
        "https://images.unsplash.com/photo-1507504031003-b417219a0fde?q=80&w=1200",
      ],
    },
    {
      title: "Zayan & Ayesha",
      location: "Cox's Bazar",
      date: "September 2024",
      type: "Destination Wedding",
      description:
        "A destination celebration by the sea — wind, waves, and timeless frames in Cox's Bazar.",
      cover:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1600",
      slug: "zayan-ayesha",
      order: 3,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200",
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200",
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200",
      ],
    },
    {
      title: "Fahim & Zarin",
      location: "Rajshahi",
      date: "August 2024",
      type: "Wedding",
      description:
        "An elegant celebration in Rajshahi — family, tradition, and quiet joy throughout the day.",
      cover:
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600",
      slug: "fahim-zarin",
      order: 4,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200",
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200",
      ],
    },
    {
      title: "Nabil & Tisha",
      location: "Khulna",
      date: "July 2024",
      type: "Reception",
      description:
        "A heartfelt reception with closest people — laughter, embraces, and memories made to last.",
      cover:
        "https://images.unsplash.com/photo-1507504031003-b417219a0fde?q=80&w=1600",
      slug: "nabil-tisha",
      order: 5,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1507504031003-b417219a0fde?q=80&w=1200",
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200",
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200",
      ],
    },
  ];

  for (const a of albumsData) {
    await prisma.album.create({
      data: {
        title: a.title,
        location: a.location,
        date: a.date,
        type: a.type,
        description: a.description,
        cover: a.cover,
        slug: a.slug,
        order: a.order,
        isFeatured: a.isFeatured,
        isPublished: true,
        images: {
          create: a.images.map((url, i) => ({
            url,
            alt: `${a.title} ${i + 1}`,
            order: i,
          })),
        },
      },
    });
  }

  // ========== PACKAGES ==========
  await prisma.package.deleteMany();
  await prisma.package.createMany({
    data: [
      {
        name: "Premium Package",
        type: "Photography + Cinematography",
        price: "49,990",
        oldPrice: "70,990",
        image: "/packages/IMG_4040.JPG.jpeg",
        popular: true,
        order: 0,
        isActive: true,
        features: JSON.stringify([
          "3 Senior Photographers",
          "3 Senior Cinematographers",
          "8 hours unlimited shoot",
          "Full light setup",
          "All RAW photos (3000–5000)",
          "500 special retouched photos",
          "200 prints (4R) + 1 photo album",
          "Pendrive + photo frame (12L)",
          "1 Cinematic trailer (1–3 min)",
          "1 Full documentation movie (15–40 min)",
        ]),
      },
      {
        name: "3 Days Wedding Combo",
        type: "Holud + Wedding + Reception",
        price: "36,000",
        oldPrice: "47,000",
        image: "/packages/IMG_4038.JPEG",
        popular: false,
        order: 1,
        isActive: true,
        features: JSON.stringify([
          "1 Senior Photographer",
          "1 Senior Cinematographer",
          "5 hours unlimited shoot each day",
          "Full light setup",
          "All RAW photos (~3000)",
          "300 special retouched photos",
          "100 prints (4R)",
          "3 Cinematic trailers",
          "3 Full documentation movies",
        ]),
      },
      {
        name: "2 Days Wedding Combo",
        type: "Haldi + Wedding",
        price: "22,990",
        oldPrice: "32,990",
        image: "/packages/IMG_4039.JPG.jpeg",
        popular: false,
        order: 2,
        isActive: true,
        features: JSON.stringify([
          "1 Senior Photographer",
          "1 Senior Cinematographer",
          "5 hours unlimited shoot each day",
          "Full light setup",
          "All RAW photos (~2000)",
          "200 special retouched photos",
          "2 Cinematic trailers",
          "2 Full documentation movies",
        ]),
      },
      {
        name: "Combo-3",
        type: "Photography + Cinematography",
        price: "21,990",
        oldPrice: "30,990",
        image: "/packages/IMG_4041.JPG.jpeg",
        popular: false,
        order: 3,
        isActive: true,
        features: JSON.stringify([
          "2 Senior Photographers",
          "2 Senior Cinematographers",
          "5 hours unlimited shoot",
          "Full light setup",
          "All RAW photos (2000–3000)",
          "200 special retouched photos",
          "50 prints (4R) + 1 album",
          "1 Cinematic trailer",
          "1 Full documentation movie",
        ]),
      },
      {
        name: "Combo-2",
        type: "Photography + Cinematography",
        price: "16,990",
        oldPrice: "23,990",
        image: "/packages/IMG_4043.JPG.jpeg",
        popular: false,
        order: 4,
        isActive: true,
        features: JSON.stringify([
          "2 Senior Photographers",
          "1 Senior Cinematographer",
          "5 hours unlimited shoot",
          "Full light setup",
          "All RAW photos (2000–3000)",
          "200 special retouched photos",
          "50 prints (4R) + 1 album",
          "1 Cinematic trailer",
          "1 Full documentation movie",
        ]),
      },
      {
        name: "Photo + Cinema",
        type: "Photography + Cinematography",
        price: "11,990",
        oldPrice: "16,990",
        image: "/packages/IMG_4044.JPG.jpeg",
        popular: false,
        order: 5,
        isActive: true,
        features: JSON.stringify([
          "1 Senior Photographer",
          "1 Senior Cinematographer",
          "5 hours unlimited shoot",
          "Full light setup",
          "All RAW photos (800–1000)",
          "100 special retouched photos",
          "1 Cinematic trailer",
          "1 Full documentation movie",
        ]),
      },
      {
        name: "Pre / Post Outdoor",
        type: "Photography + Cinematography",
        price: "10,990",
        oldPrice: "16,990",
        image: "/packages/IMG_4036.JPG.jpeg",
        popular: false,
        order: 6,
        isActive: true,
        features: JSON.stringify([
          "1 Senior Photographer",
          "1 Senior Cinematographer",
          "2–3 hours unlimited shoot",
          "All RAW photos",
          "100 special retouched photos",
          "1 Cinematic trailer (1–3 min)",
        ]),
      },
      {
        name: "Moment with RH Rishat",
        type: "Only Photography",
        price: "9,990",
        oldPrice: null,
        image: "/packages/IMG_4047.JPG.jpeg",
        popular: false,
        order: 7,
        isActive: true,
        features: JSON.stringify([
          "Photographer RH Rishat (full time)",
          "5 hours unlimited (Indoor + Outdoor)",
          "Full light setup",
          "Full frame camera & lenses",
          "100 special edited photos",
        ]),
      },
      {
        name: "Only Photography",
        type: "Photography only",
        price: "6,990",
        oldPrice: "9,990",
        image: "/packages/IMG_4045.JPG.jpeg",
        popular: false,
        order: 8,
        isActive: true,
        features: JSON.stringify([
          "1 Senior Photographer",
          "5 hours unlimited photoshoot",
          "Full light setup",
          "All RAW photos (800–1000)",
          "100 special retouched photos",
        ]),
      },
      {
        name: "Outdoor Only Photo",
        type: "Pre / Post Wedding",
        price: "5,990",
        oldPrice: "8,500",
        image: "/packages/IMG_4037.JPG.jpeg",
        popular: false,
        order: 9,
        isActive: true,
        features: JSON.stringify([
          "1 Senior Photographer",
          "2–3 hours unlimited photoshoot",
          "All RAW photos",
          "100 special retouched photos",
        ]),
      },
    ],
  });

  // ========== FAQ ==========
  await prisma.faq.deleteMany();
  await prisma.faq.createMany({
    data: [
      {
        question: "How far in advance should we book?",
        answer:
          "We recommend booking 3–6 months in advance, especially for peak wedding season. Popular dates fill up quickly, so earlier is always better.",
        order: 0,
        isActive: true,
      },
      {
        question: "Do you travel outside Dhaka?",
        answer:
          "Yes. We cover weddings across Bangladesh and selected destination events. Travel fees may apply depending on the location.",
        order: 1,
        isActive: true,
      },
      {
        question: "How many photos will we receive?",
        answer:
          "All our packages include unlimited photos with full post-processing. You receive every good frame from the day — no strict number limit.",
        order: 2,
        isActive: true,
      },
      {
        question: "When will we get the final photos?",
        answer:
          "Edited photos are typically delivered within 4–6 weeks after the event. Highlight films may take a little longer depending on the package.",
        order: 3,
        isActive: true,
      },
      {
        question: "What is your payment policy?",
        answer:
          "To confirm a booking, 80% advance payment is required. The remaining balance is due before or on the event day. Free rescheduling is available subject to our schedule. Cancellation fee is 30%.",
        order: 4,
        isActive: true,
      },
      {
        question: "Can we request a specific editing style?",
        answer:
          "Yes. We have a consistent timeless style, but we are happy to discuss preferences during the consultation so the final gallery feels right for you.",
        order: 5,
        isActive: true,
      },
      {
        question: "Do you provide a second photographer?",
        answer:
          "Higher packages include two or more photographers. For other packages, an additional photographer can be added on request for an extra fee.",
        order: 6,
        isActive: true,
      },
      {
        question: "Will you post our photos on social media?",
        answer:
          "We may share selected images on our website and social channels. If you prefer privacy, just let us know — we fully respect your wishes.",
        order: 7,
        isActive: true,
      },
    ],
  });

  console.log("✅ Seed complete");
  console.log("   Admin:", email, "/", password);
  console.log("   Seeded: Sliders, Our Story, Contact, Socials, Albums, Packages, FAQs");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
