/**
 * seed.js
 * Inserts sample product data into the database.
 * This function is called ONLY when the products table is empty.
 *
 * @param {import('better-sqlite3').Database} db
 */
function seed(db) {
  const insert = db.prepare(`
    INSERT INTO products (name, description, price, image, category, stock)
    VALUES (@name, @description, @price, @image, @category, @stock)
  `);

  // Use a transaction so all inserts succeed or none do
  const insertMany = db.transaction((products) => {
    for (const product of products) {
      insert.run(product);
    }
  });

  const products = [
    // Audio
    {
      name: 'Wireless Noise Cancelling Headphones',
      description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and foldable design. Perfect for travel, work from home, or everyday listening.',
      price: 249.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      category: 'Audio',
      stock: 45,
    },
    {
      name: 'Bluetooth Earbuds Pro',
      description: 'True wireless earbuds with spatial audio, adaptive EQ, and sweat resistance. Includes a wireless charging case for up to 24 hours of total listening time.',
      price: 159.99,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
      category: 'Audio',
      stock: 80,
    },
    {
      name: 'Portable Bluetooth Speaker',
      description: 'Waterproof (IPX7) portable speaker with 360° surround sound, 20-hour playtime, and built-in microphone for hands-free calls. Charges via USB-C.',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
      category: 'Audio',
      stock: 50,
    },
    {
      name: 'Desktop Soundbar',
      description: 'Compact desktop soundbar with dynamic RGB lighting, dual 5W drivers for clear stereo sound, and easy USB plug-and-play setup.',
      price: 45.99,
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
      category: 'Audio',
      stock: 25,
    },

    // Computer Accessories
    {
      name: 'Mechanical Gaming Keyboard',
      description: 'Compact TKL mechanical keyboard with tactile switches, per-key RGB backlighting, and a durable aluminium frame. Ideal for gaming and fast typing.',
      price: 119.99,
      image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',
      category: 'Computer Accessories',
      stock: 30,
    },
    {
      name: 'Wireless Ergonomic Keyboard',
      description: 'Split ergonomic keyboard designed to reduce wrist strain. Features a cushioned palm rest and seamless Bluetooth switching across 3 devices.',
      price: 99.99,
      image: 'https://images.unsplash.com/photo-1529336953128-a85760f58cb5?w=800&q=80',
      category: 'Computer Accessories',
      stock: 40,
    },
    {
      name: 'Wireless Ergonomic Mouse',
      description: 'Ergonomic wireless mouse with a comfortable vertical grip, 2.4 GHz connectivity, adjustable DPI, and up to 90-day battery life.',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
      category: 'Computer Accessories',
      stock: 60,
    },
    {
      name: 'USB-C 7-in-1 Hub',
      description: 'Expand your laptop ports with this slim USB-C hub: 4K HDMI, 2× USB-A 3.0, USB-C 100W PD charging, SD & MicroSD card readers.',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1593642702821-c823b285f829?w=800&q=80',
      category: 'Computer Accessories',
      stock: 120,
    },
    {
      name: 'Aluminium Laptop Stand',
      description: 'Adjustable aluminium laptop stand with 6 height angles. Improves ergonomics by raising your screen to eye level.',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
      category: 'Computer Accessories',
      stock: 75,
    },
    {
      name: 'RGB Wireless Mouse Pad',
      description: 'Extended gaming mouse pad with 15 lighting modes and an integrated 15W Qi wireless charger for your smartphone.',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1621252179027-94459d278660?w=800&q=80',
      category: 'Computer Accessories',
      stock: 35,
    },

    // Workspace / Displays
    {
      name: '27-inch 4K IPS Monitor',
      description: 'Stunning 4K UHD monitor with 99% sRGB color accuracy, USB-C connectivity, and ultra-thin bezels. Perfect for creative professionals.',
      price: 349.99,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
      category: 'Workspace',
      stock: 15,
    },
    {
      name: '1080p Full HD Webcam',
      description: 'Plug-and-play Full HD webcam with auto-focus, built-in noise-reducing microphone, and a universal clip for monitors and laptops.',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1585298723682-7115561c51b7?w=800&q=80',
      category: 'Workspace',
      stock: 50,
    },
    {
      name: 'Monitor Light Bar',
      description: 'Screen-glare-free LED monitor light bar with adjustable color temperature and auto-dimming features. Saves desk space.',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
      category: 'Workspace',
      stock: 60,
    },

    // Mobile / Accessories
    {
      name: '65W USB-C Fast Charger',
      description: 'Compact GaN fast charger with 2 USB-C ports and 1 USB-A port. Capable of charging a laptop and smartphone simultaneously.',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80',
      category: 'Mobile Accessories',
      stock: 150,
    },
    {
      name: 'Magnetic Wireless Charging Pad',
      description: 'Sleek 15W magnetic wireless charger compatible with latest smartphones. Includes a braided 1.5m USB-C cable.',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800&q=80',
      category: 'Mobile Accessories',
      stock: 90,
    },
    {
      name: '20000mAh Power Bank',
      description: 'High-capacity portable charger with PD 20W fast charging. Can charge an average smartphone up to 5 times on a single charge.',
      price: 45.99,
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80',
      category: 'Mobile Accessories',
      stock: 85,
    },
    {
      name: 'Braided USB-C to USB-C Cable (6ft)',
      description: 'Durable nylon braided charging cable supporting up to 100W power delivery and fast data transfer speeds.',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80',
      category: 'Mobile Accessories',
      stock: 200,
    },

    // Wearables
    {
      name: 'Smart Watch Series X',
      description: 'Feature-rich smart watch with an Always-On OLED display, ECG app, blood oxygen sensor, and advanced fitness tracking.',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
      category: 'Wearables',
      stock: 20,
    },
    {
      name: 'Fitness Tracker Pro',
      description: 'Slim fitness band with 24/7 heart rate monitoring, sleep analysis, built-in GPS, and up to 10 days of battery life.',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=800&q=80',
      category: 'Wearables',
      stock: 45,
    },

    // Gaming
    {
      name: 'Wireless Gaming Controller',
      description: 'Pro-grade wireless controller with textured grips, customizable button mapping, and haptic feedback. Compatible with PC and consoles.',
      price: 69.99,
      image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&q=80',
      category: 'Gaming',
      stock: 50,
    },
    {
      name: 'High-Precision Gaming Mouse',
      description: 'Lightweight wired gaming mouse with a 16000 DPI optical sensor, 6 programmable buttons, and a braided cable.',
      price: 54.99,
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
      category: 'Gaming',
      stock: 40,
    },
    {
      name: 'USB Gaming Headset',
      description: '7.1 surround sound gaming headset with a noise-canceling boom mic, memory foam ear pads, and intuitive inline audio controls.',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
      category: 'Gaming',
      stock: 35,
    },
    {
      name: 'Gaming Capture Card',
      description: 'Stream and record in flawless 1080p60 or 4K at 30fps. Ultra-low latency technology ensures your stream stays perfectly synced.',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80',
      category: 'Gaming',
      stock: 12,
    },

    // Networking
    {
      name: 'Wi-Fi 6 Mesh Router System',
      description: 'Next-gen Wi-Fi 6 mesh system covering up to 4500 sq ft. Connect over 100 devices with zero lag and seamless roaming.',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=800&q=80',
      category: 'Networking',
      stock: 18,
    },
    {
      name: 'USB Wi-Fi 6 Adapter',
      description: 'Upgrade your PC or laptop to Wi-Fi 6 with this compact dual-band USB adapter. Enjoy speeds up to 1800 Mbps.',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1622445272461-c6580cab6efa?w=800&q=80',
      category: 'Networking',
      stock: 55,
    }
  ];

  insertMany(products);
}

module.exports = seed;
