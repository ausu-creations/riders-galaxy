// Sample product data for the Shop page
import HelmetsImg from "../assets/images/Helemts.png";
import JacketsImg from "../assets/images/Jackets.png";
import GlovesImg from "../assets/images/Gloves.png";
import PantsImg from "../assets/images/Pants.png";
import BootsImg from "../assets/images/Boots.png";
import IntercomImg from "../assets/images/Intercoms.jpg";
import ExhaustImg from "../assets/images/exhausts.jpg";
import AirFilterImg from "../assets/images/air-filter.jpg";
import Banner1Img from "../assets/images/banner-1.jpg";

const products = [
  {
    id: 1,
    title: "Adventure Helmet",
    price: 199.99,
    category: "Helmets",
    brand: "LS2",
    image: HelmetsImg,
    images: [HelmetsImg, Banner1Img],
    description: "Lightweight full-face helmet with advanced ventilation and removable liner.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Matte Black", "White", "Red"],
  },
  {
    id: 2,
    title: "Riding Jacket",
    price: 249.99,
    category: "Riding Jackets",
    brand: "Rynox",
    image: JacketsImg,
    images: [JacketsImg],
    description: "Abrasion-resistant textile jacket with CE-rated armor and waterproof liner.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Black", "Gray"],
  },
  {
    id: 3,
    title: "Premium Gloves",
    price: 49.99,
    category: "Riding Gloves",
    brand: "Axor",
    image: GlovesImg,
    images: [GlovesImg],
    description: "Comfort-fit gloves with reinforced palms and touchscreen capability.",
    sizes: ["S", "M", "L"],
    colors: ["Black", "Brown"],
  },
  {
    id: 4,
    title: "Touring Pants",
    price: 129.99,
    category: "Riding Pants",
    brand: "Rynox",
    image: PantsImg,
    images: [PantsImg],
    description: "Durable touring pants with stretch panels and waterproofing.",
    sizes: ["M", "L", "XL"],
    colors: ["Black"],
  },
  {
    id: 5,
    title: "Rugged Boots",
    price: 179.99,
    category: "Riding Boots",
    brand: "Royal Enfield",
    image: BootsImg,
    images: [BootsImg],
    description: "High-traction boots with ankle protection and waterproof membrane.",
    sizes: ["8", "9", "10", "11"],
    colors: ["Brown", "Black"],
  },
  {
    id: 6,
    title: "Bluetooth Intercom",
    price: 159.99,
    category: "Intercom",
    brand: "DSG",
    image: IntercomImg,
    images: [IntercomImg],
    description: "Helmet-fit Bluetooth intercom with 1km range and noise cancellation.",
    sizes: [],
    colors: ["Black"],
  },
  {
    id: 7,
    title: "Performance Exhaust",
    price: 399.0,
    category: "Exhausts",
    brand: "Raida",
    image: ExhaustImg,
    images: [ExhaustImg],
    description: "Free-flow performance exhaust for improved torque and aggressive sound.",
    sizes: [],
    colors: ["Brushed"],
  },
  {
    id: 8,
    title: "High-Flow Air Filter",
    price: 39.99,
    category: "Air Filter",
    brand: "Korda",
    image: AirFilterImg,
    images: [AirFilterImg],
    description: "Washable high-flow air filter for better engine breathing.",
    sizes: [],
    colors: [],
  },
];

export default products;
