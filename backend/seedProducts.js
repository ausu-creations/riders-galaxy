require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

// Sample product data (same as frontend products.js)
const productsData = [
  {
    title: "Adventure Helmet",
    price: 199.99,
    category: "Helmets",
    brand: "LS2",
    description: "Lightweight full-face helmet with advanced ventilation and removable liner.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Matte Black", "White", "Red"],
    tripReady: true,
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop"],
    stock: 10,
    sizeStock: [
      { size: "S", stock: 2 },
      { size: "M", stock: 3 },
      { size: "L", stock: 3 },
      { size: "XL", stock: 2 }
    ]
  },
  {
    title: "Riding Jacket",
    price: 249.99,
    category: "Riding Jackets",
    brand: "Rynox",
    description: "Abrasion-resistant textile jacket with CE-rated armor and waterproof liner.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Black", "Gray"],
    tripReady: true,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop"],
    stock: 8,
    sizeStock: [
      { size: "M", stock: 2 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 2 },
      { size: "XXL", stock: 2 }
    ]
  },
  {
    title: "Premium Gloves",
    price: 49.99,
    category: "Riding Gloves",
    brand: "Axor",
    description: "Comfort-fit gloves with reinforced palms and touchscreen capability.",
    sizes: ["S", "M", "L"],
    colors: ["Black", "Brown"],
    tripReady: true,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop"],
    stock: 15,
    sizeStock: [
      { size: "S", stock: 5 },
      { size: "M", stock: 5 },
      { size: "L", stock: 5 }
    ]
  },
  {
    title: "Touring Pants",
    price: 129.99,
    category: "Riding Pants",
    brand: "Rynox",
    description: "Durable touring pants with stretch panels and waterproofing.",
    sizes: ["M", "L", "XL"],
    colors: ["Black"],
    tripReady: true,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"],
    stock: 6,
    sizeStock: [
      { size: "M", stock: 2 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 2 }
    ]
  },
  {
    title: "Rugged Boots",
    price: 179.99,
    category: "Riding Boots",
    brand: "Royal Enfield",
    description: "High-traction boots with ankle protection and waterproof membrane.",
    sizes: ["8", "9", "10", "11"],
    colors: ["Brown", "Black"],
    tripReady: true,
    image: "https://images.unsplash.com/photo-1608256766291-357bd8e2e677?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1608256766291-357bd8e2e677?w=400&h=400&fit=crop"],
    stock: 8,
    sizeStock: [
      { size: "8", stock: 2 },
      { size: "9", stock: 2 },
      { size: "10", stock: 2 },
      { size: "11", stock: 2 }
    ]
  },
  {
    title: "Bluetooth Intercom",
    price: 159.99,
    category: "Intercom",
    brand: "DSG",
    description: "Helmet-fit Bluetooth intercom with 1km range and noise cancellation.",
    sizes: [],
    colors: ["Black"],
    tripReady: true,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop"],
    stock: 5,
    sizeStock: []
  },
  {
    title: "Performance Exhaust",
    price: 399.0,
    category: "Exhausts",
    brand: "Raida",
    description: "Free-flow performance exhaust for improved torque and aggressive sound.",
    sizes: [],
    colors: ["Brushed"],
    tripReady: false,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"],
    stock: 3,
    sizeStock: []
  },
  {
    title: "High-Flow Air Filter",
    price: 39.99,
    category: "Air Filter",
    brand: "Korda",
    description: "Washable high-flow air filter for better engine breathing.",
    sizes: [],
    colors: [],
    tripReady: false,
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop"],
    stock: 10,
    sizeStock: []
  },
  {
    title: "Custom Jersey",
    price: 89.99,
    category: "Jersey",
    brand: "Fox Racing",
    description: "Custom racing jersey for track and trail riding.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Red", "Blue", "Black"],
    tripReady: false,
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&h=400&fit=crop"],
    stock: 12,
    sizeStock: [
      { size: "S", stock: 3 },
      { size: "M", stock: 3 },
      { size: "L", stock: 3 },
      { size: "XL", stock: 3 }
    ]
  },
  {
    title: "Hydration Pack",
    price: 49.99,
    category: "Hydration",
    brand: "CamelBak",
    description: "Lightweight hydration pack for long rides.",
    sizes: [],
    colors: ["Black", "Blue"],
    tripReady: true,
    image: "https://images.unsplash.com/photo-1627920584218-00d1a21a3573?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1627920584218-00d1a21a3573?w=400&h=400&fit=crop"],
    stock: 7,
    sizeStock: []
  },
  // AXOR Helmets Collection - Using representative helmet images
  {
    title: "Axor Apex Marvel Spider Man Edition Full-Face Helmet With Spoiler",
    price: 6500.00,
    category: "Helmets",
    brand: "Axor",
    description: "Fully licensed Marvel helmet with bold white web-line graphics on gunmetal-black. Features dual visor system, multi-point ventilation, aerodynamic rear spoiler, and triple-certified protection (ISI, DOT, ECE 22.06). Includes Pinlock 30 anti-fog layer.",
    sizes: ["M", "L", "XL"],
    colors: ["Black White", "Dull Black White"],
    tripReady: true,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"],
    stock: 9,
    sizeStock: [
      { size: "M", stock: 3 },
      { size: "L", stock: 3 },
      { size: "XL", stock: 3 }
    ]
  },
  {
    title: "Axor X Altor Apex Venomous Smart Bluetooth Helmet",
    price: 8500.00,
    category: "Helmets",
    brand: "Axor",
    description: "Smart Bluetooth helmet with advanced connectivity features. Integrated Bluetooth system for seamless communication, dual visor system, and aerodynamic design for optimal performance.",
    sizes: ["M", "L", "XL"],
    colors: ["Black Blue", "Black Grey"],
    tripReady: true,
    image: "https://images.unsplash.com/photo-1572493368167-5aed4069fa2c?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1572493368167-5aed4069fa2c?w=400&h=400&fit=crop"],
    stock: 6,
    sizeStock: [
      { size: "M", stock: 2 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 2 }
    ]
  },
  {
    title: "Brutale Corsa Dual Spoiler Helmet",
    price: 7991.00,
    category: "Helmets",
    brand: "Axor",
    description: "ISI, DOT, and ECE 22.06 certified helmet with scratch-resistant UV-protected visor, center-locking quick-release system, and D-ring buckle. Features advanced polycarbonate shell, dual spoilers, and Pinlock 70 ready for fog-free vision.",
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: ["White Blue", "White Red", "Black Green", "Black Gold Orange", "Khaki Green", "Khaki Orange", "Dull Black Red", "Athena Grey Red"],
    tripReady: true,
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&h=400&fit=crop"],
    stock: 10,
    sizeStock: [
      { size: "S", stock: 2 },
      { size: "M", stock: 2 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 2 },
      { size: "2XL", stock: 2 }
    ]
  },
  {
    title: "Apex Ascetic Helmet",
    price: 5500.00,
    category: "Helmets",
    brand: "Axor",
    description: "Minimalist design helmet with superior aerodynamics. Features advanced ventilation system, optically correct visor, and meets ISI, DOT, and ECE safety standards.",
    sizes: ["M", "L", "XL"],
    colors: ["Stone Black Grey", "Dull Stone Black Grey", "Red Grey", "Dull Red Grey"],
    tripReady: true,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop"],
    stock: 9,
    sizeStock: [
      { size: "M", stock: 3 },
      { size: "L", stock: 3 },
      { size: "XL", stock: 3 }
    ]
  },
  {
    title: "Axor xBhp Bionic Helmet",
    price: 6200.00,
    category: "Helmets",
    brand: "Axor",
    description: "Collaboration helmet with xBhp featuring bionic design elements. Advanced composite shell construction, dual visor system, and superior ventilation for optimal airflow.",
    sizes: ["M", "L", "XL"],
    colors: ["White Red"],
    tripReady: true,
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop"],
    stock: 6,
    sizeStock: [
      { size: "M", stock: 2 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 2 }
    ]
  },
  {
    title: "Brutale Kryptic Dual Spoiler Helmet",
    price: 7500.00,
    category: "Helmets",
    brand: "Axor",
    description: "Aggressive dual spoiler design with cryptic graphics. Features polycarbonate shell, dual visor system, Bluetooth compatibility, and meets international safety standards.",
    sizes: ["M", "L", "XL"],
    colors: ["Black Green", "Black Yellow", "Black Grey", "Dull Black Grey"],
    tripReady: true,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"],
    stock: 8,
    sizeStock: [
      { size: "M", stock: 3 },
      { size: "L", stock: 3 },
      { size: "XL", stock: 2 }
    ]
  },
  {
    title: "Brutale Surges Dual Spoiler Helmet",
    price: 7200.00,
    category: "Helmets",
    brand: "Axor",
    description: "Dynamic dual spoiler helmet with surge-inspired design. Advanced ventilation system, quick-release visor mechanism, and D-ring buckle for secure fit.",
    sizes: ["M", "L", "XL"],
    colors: ["Red Grey"],
    tripReady: true,
    image: "https://images.unsplash.com/photo-1572493368167-5aed4069fa2c?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1572493368167-5aed4069fa2c?w=400&h=400&fit=crop"],
    stock: 6,
    sizeStock: [
      { size: "M", stock: 2 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 2 }
    ]
  },
  {
    title: "Brutale Ryden Dual Spoiler Helmet",
    price: 7300.00,
    category: "Helmets",
    brand: "Axor",
    description: "Street-inspired dual spoiler helmet with modern aesthetics. Features polycarbonate shell, internal sun visor, and aerodynamic dual spoilers for stability at high speeds.",
    sizes: ["M", "L", "XL"],
    colors: ["White Red"],
    tripReady: true,
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&h=400&fit=crop"],
    stock: 6,
    sizeStock: [
      { size: "M", stock: 2 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 2 }
    ]
  },
  {
    title: "X-Cross Dual Visor Gambling Helmet",
    price: 6800.00,
    category: "Helmets",
    brand: "Axor",
    description: "Off-road inspired helmet with gambling-themed graphics. Dual visor system, advanced ventilation, and rugged construction for adventure riding.",
    sizes: ["M", "L", "XL"],
    colors: ["Black Blue", "Black Neon Yellow"],
    tripReady: true,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"],
    stock: 6,
    sizeStock: [
      { size: "M", stock: 2 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 2 }
    ]
  },
  {
    title: "Brutale Solid Colors Dual Spoiler Helmet",
    price: 6500.00,
    category: "Helmets",
    brand: "Axor",
    description: "Clean and classic dual spoiler helmet in solid colors. Features polycarbonate shell, dual visor system, and meets ISI, DOT, and ECE safety certifications.",
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Dull Black", "White"],
    tripReady: true,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop"],
    stock: 9,
    sizeStock: [
      { size: "M", stock: 3 },
      { size: "L", stock: 3 },
      { size: "XL", stock: 3 }
    ]
  },
  {
    title: "Apex Infinity Helmet",
    price: 5800.00,
    category: "Helmets",
    brand: "Axor",
    description: "Sleek and modern helmet with infinity-inspired design. Advanced ventilation system, optically correct visor, and lightweight construction for comfort on long rides.",
    sizes: ["M", "L", "XL"],
    colors: ["Black Gold"],
    tripReady: true,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"],
    stock: 6,
    sizeStock: [
      { size: "M", stock: 2 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 2 }
    ]
  },
  {
    title: "Axor X Altor Apex Smart Bluetooth Helmet",
    price: 8200.00,
    category: "Helmets",
    brand: "Axor",
    description: "Premium smart helmet with integrated Bluetooth connectivity. Features dual visor system, advanced ventilation, and seamless smartphone integration for calls and music.",
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Dull Black"],
    tripReady: true,
    image: "https://images.unsplash.com/photo-1572493368167-5aed4069fa2c?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1572493368167-5aed4069fa2c?w=400&h=400&fit=crop"],
    stock: 6,
    sizeStock: [
      { size: "M", stock: 2 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 2 }
    ]
  },
  {
    title: "Hunter DC Superman Helmet",
    price: 7000.00,
    category: "Helmets",
    brand: "Axor",
    description: "Official DC licensed Superman helmet with iconic graphics. Features dual visor system, multi-point ventilation, and triple-certified protection for superhero-level safety.",
    sizes: ["M", "L", "XL"],
    colors: ["Red Black", "Dull Red Black"],
    tripReady: true,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"],
    stock: 6,
    sizeStock: [
      { size: "M", stock: 2 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 2 }
    ]
  },
  {
    title: "Street Marvel Captain America Helmet",
    price: 6800.00,
    category: "Helmets",
    brand: "Axor",
    description: "Official Marvel licensed Captain America helmet with patriotic design. Features dual visor system, advanced ventilation, and meets international safety standards.",
    sizes: ["M", "L", "XL"],
    colors: ["Blue Red White", "Dull Blue Red White"],
    tripReady: true,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"],
    stock: 6,
    sizeStock: [
      { size: "M", stock: 2 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 2 }
    ]
  },
  {
    title: "Saber Sasuke Helmet",
    price: 6400.00,
    category: "Helmets",
    brand: "Axor",
    description: "Anime-inspired Sasuke themed helmet with striking graphics. Features dual visor system, advanced ventilation, and lightweight construction for optimal performance.",
    sizes: ["M", "L", "XL"],
    colors: ["Dark Blue Black", "Dull Dark Blue Black"],
    tripReady: true,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"],
    stock: 6,
    sizeStock: [
      { size: "M", stock: 2 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 2 }
    ]
  }
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/riders-galaxy');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Drop the slug index if it exists
    try {
      await Product.collection.dropIndex('slug_1');
      console.log('Dropped slug_1 index');
    } catch (error) {
      console.log('No slug index to drop or error dropping it:', error.message);
    }

    // Insert new products one by one to handle any errors
    let insertedCount = 0;
    for (const productData of productsData) {
      try {
        // Add a unique slug based on title
        const productWithSlug = {
          ...productData,
          slug: productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        };
        const product = new Product(productWithSlug);
        await product.save();
        console.log(`✓ Inserted: ${productData.title}`);
        insertedCount++;
      } catch (error) {
        console.error(`✗ Failed to insert: ${productData.title}`, error.message);
      }
    }

    console.log(`Successfully inserted ${insertedCount} out of ${productsData.length} products`);

  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedProducts();