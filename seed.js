const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('./models/Category');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/riders-galaxy';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Create Categories
    const helmetCategory = await Category.create({
      name: 'Helmets',
      slug: 'helmets',
      description: 'Full-face, modular, and off-road helmets for ultimate safety.'
    });

    const jacketCategory = await Category.create({
      name: 'Riding Jackets',
      slug: 'riding-jackets',
      description: 'Abrasion-resistant touring and racing riding jackets.'
    });

    // Create Products
    await Product.insertMany([
      {
        title: 'LS2 Storm Vector Full Face Helmet',
        slug: 'ls2-storm-vector-helmet',
        brand: 'LS2',
        category: helmetCategory._id,
        price: 185.00,
        stock: 15,
        images: ['assets/images/brands/ls2.png'],
        description: 'Aerodynamic lightweight shell with integrated sun visor.',
        fitment: 'Universal'
      },
      {
        title: 'Rynox Tornado Pro Riding Jacket',
        slug: 'rynox-tornado-pro-jacket',
        brand: 'Rynox',
        category: jacketCategory._id,
        price: 210.00,
        stock: 8,
        images: ['assets/images/brands/rynox.png'],
        description: 'All-season mesh jacket with CE level 2 protectors.',
        fitment: 'Universal'
      }
    ]);

    console.log('Database seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedData();