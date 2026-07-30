const mongoose = require('mongoose');
const Bike = require('./models/Bike');
require('dotenv').config();

const initialBikes = [
  {
    brand: "Royal Enfield",
    models: [
      "Classic 350",
      "Classic 500",
      "Bullet 350",
      "Bullet 500",
      "Himalayan",
      "Himalayan 450",
      "Scram 411",
      "Interceptor 650",
      "Continental GT 650",
      "Meteor 350",
      "Hunter 350",
      "Super Meteor 650",
      "Thunderbird 350",
      "Thunderbird 500",
    ]
  },
  {
    brand: "Honda",
    models: [
      "CB Shine",
      "CB Unicorn",
      "CB Hornet",
      "CBR 150R",
      "CBR 250R",
      "CBR 600RR",
      "CBR 1000RR",
      "Activa 6G",
      "Dio",
      "Africa Twin",
      "CBR 650R",
      "Hness CB350",
      "XBlade",
    ]
  },
  {
    brand: "Bajaj",
    models: [
      "Pulsar 150",
      "Pulsar 180",
      "Pulsar 220F",
      "Pulsar NS160",
      "Pulsar NS200",
      "Pulsar RS200",
      "Pulsar N160",
      "Pulsar N250",
      "Dominar 250",
      "Dominar 400",
      "Avenger 160",
      "Avenger 220",
      "CT 100",
      "Platina 100",
    ]
  },
  {
    brand: "Yamaha",
    models: [
      "R15 V3",
      "R15 V4",
      "MT-15",
      "MT-03",
      "FZ-25",
      "FZ-S V3",
      "YZF R3",
      "YZF R1",
      "YZF R1M",
      "FZS-FI V3",
      "Fazer 25",
      "Ray ZR",
      "Fascino",
    ]
  },
  {
    brand: "TVS",
    models: [
      "Apache RTR 160",
      "Apache RTR 180",
      "Apache RTR 200 4V",
      "Apache RR 310",
      "Apache 310",
      "Sport 160",
      "Ronin",
      "Jupiter",
      "Wego",
      "Ntorq",
      "Raider",
    ]
  },
  {
    brand: "KTM",
    models: [
      "Duke 125",
      "Duke 200",
      "Duke 250",
      "Duke 390",
      "Duke 790",
      "Duke 890",
      "RC 125",
      "RC 200",
      "RC 390",
      "RC 890",
      "Adventure 390",
      "Adventure 790",
      "Adventure 890",
    ]
  },
  {
    brand: "Suzuki",
    models: [
      "Gixxer 150",
      "Gixxer 250",
      "Gixxer SF 150",
      "Gixxer SF 250",
      "GSX-R150",
      "GSX-R250",
      "GSX-R1000",
      "Hayabusa",
      "V-Strom 650",
      "V-Strom 1000",
      "Access 125",
      "Burgman Street",
    ]
  },
  {
    brand: "Kawasaki",
    models: [
      "Ninja 300",
      "Ninja 400",
      "Ninja 650",
      "Ninja 1000",
      "Ninja H2",
      "Z900",
      "Z1000",
      "Versys 650",
      "Versys 1000",
      "KLR 650",
      "Vulcan S",
      "KLX 450",
    ]
  },
  {
    brand: "Hero",
    models: [
      "Splendor Plus",
      "Passion Pro",
      "Glamour",
      "HF Deluxe",
      "Xtreme 160R",
      "Xtreme 200S",
      "Xpulse 200",
      "Xpulse 200T",
      "Karizma XMR",
      "Destini 125",
      "Maestro Edge",
      "Pleasure Plus",
    ]
  },
  {
    brand: "Harley-Davidson",
    models: [
      "Iron 883",
      "Street 750",
      "Forty-Eight",
      "Roadster",
      "Street Bob",
      "Fat Bob",
      "Softail",
      "Breakout",
      "Fat Boy",
      "Heritage Classic",
      "Street Glide",
      "Road Glide",
    ]
  },
  {
    brand: "BMW",
    models: [
      "G 310 R",
      "G 310 GS",
      "S 1000 RR",
      "S 1000 R",
      "R 1250 GS",
      "R 1250 RT",
      "R 1250 RS",
      "K 1600 GT",
      "K 1600 GTL",
      "F 900 R",
      "F 900 XR",
    ]
  },
  {
    brand: "Ducati",
    models: [
      "Panigale V2",
      "Panigale V4",
      "Monster 821",
      "Monster 1200",
      "Multistrada 950",
      "Multistrada 1260",
      "SuperSport 950",
      "SuperSport S",
      "Scrambler Icon",
      "Scrambler Cafe Racer",
      "Hypermotard 950",
    ]
  },
  {
    brand: "Triumph",
    models: [
      "Street Triple",
      "Daytona 675",
      "Tiger 800",
      "Tiger 1200",
      "Bonneville",
      "Thruxton",
      "Scrambler 1200",
      "Speed Triple",
      "Rocket 3",
      "Bonneville Bobber",
    ]
  },
  {
    brand: "Jawa",
    models: [
      "Forty Two",
      "Classic",
      "Perak",
      "42 Bobber",
    ]
  },
  {
    brand: "Benelli",
    models: [
      "Imperiale 400",
      "TRK 502",
      "TRK 502X",
      "Leoncino 500",
      "TNT 600i",
      "TNT 600GT",
    ]
  },
  {
    brand: "Mahindra",
    models: [
      "Mojo",
      "Gusto",
      "Centuro",
      "Duro",
    ]
  },
];

async function seedBikes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing bikes
    await Bike.deleteMany({});
    console.log('Cleared existing bikes');

    // Insert initial bikes
    await Bike.insertMany(initialBikes);
    console.log('Initial bikes seeded successfully');

    console.log('Total bikes seeded:', initialBikes.length);
  } catch (error) {
    console.error('Error seeding bikes:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedBikes();