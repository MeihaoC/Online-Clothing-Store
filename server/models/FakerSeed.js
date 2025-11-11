const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

// Importing models
const Product = require("./Product");
const User = require("./User");
const Order = require("./Order");

// Loading environment variables
require("dotenv").config();

// Validate environment variables
if (!process.env.MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

// Connecting to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Sample image URLs for products
const imageUrls = [
  "https://i.postimg.cc/DwsJYggg/cs606-ylw-a0.webp",
  "https://i.postimg.cc/cLy468qk/fe8eb1c065800b123a422b7abf3e5819.webp",
  "https://i.postimg.cc/FHMPMNLL/815561a57ec37cfa21c13362d809406a.jpg",
  "https://i.postimg.cc/PfWDth8j/the-apricot-solid-button-knit-top-apricot-tops-u8zuyg-999314-650x.webp",
  "https://i.postimg.cc/RCtbT3Jz/5c6588bdd9130fe0a0f1681fbcb62f75.webp",
];

// Function to seed products
const seedProducts = async (num) => {
  const categories = ["Top", "Pants", "Dress"];
  const categoryPrefixes = {
    Top: ["ActiveFit™", "PowerFlex™", "LuxeComfort™"],
    Pants: ["FlexWear™", "PerformanceGear™", "Athleisure™"],
    Dress: ["ChicStyle™", "ElegantLine™", "EveningGlam™"],
  };

  const categorySuffixes = {
    Top: ["T-Shirt", "Tank Top", "Blouse"],
    Pants: ["Leggings", "Joggers", "Trousers"],
    Dress: ["Maxi Dress", "Cocktail Dress", "Summer Dress"],
  };

  const sizes = ["S", "M", "L", "XL"];
  const products = [];

  for (let i = 0; i < num; i++) {
    const category = faker.helpers.arrayElement(categories);
    const prefix = faker.helpers.arrayElement(categoryPrefixes[category]);
    const suffix = faker.helpers.arrayElement(categorySuffixes[category]);
    const name = `${prefix} ${suffix}`;
    const imageUrl = faker.helpers.arrayElement(imageUrls);

    // Create product data
    products.push({
      name: name,
      category: category,
      price: parseFloat(faker.commerce.price({ min: 20, max: 150 })),
      size: faker.helpers.arrayElement(sizes),
      description: faker.commerce.productDescription(),
      imageUrl,
    });
  }

  await Product.insertMany(products);
  console.log(`${num} products seeded`);
};

// Function to seed users
const seedUsers = async (num) => {
  const users = [];
  for (let i = 0; i < num; i++) {
    const user = new User({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      cart: [],
      orderHistory: [],
    });
    // Hash the password using the User model's method
    const password = faker.internet.password({ length: 12 });
    user.password = await user.hashPassword(password);
    users.push(user);
  }
  await User.insertMany(users);
  console.log(`${num} users seeded`);
};

// Function to seed orders
const seedOrders = async (num) => {
  const users = await User.find();
  const products = await Product.find();

  if (users.length === 0 || products.length === 0) {
    console.log("Ensure users and products are seeded before running order seeds.");
    return;
  }

  const currencies = ["USD", "EUR", "GBP", "CAD"];
  const orders = [];

  for (let i = 0; i < num; i++) {
    const user = faker.helpers.arrayElement(users);
    const numProducts = faker.number.int({ min: 1, max: 5 });
    const selectedProducts = faker.helpers.arrayElements(products, numProducts);
    const orderProducts = selectedProducts.map((product) => ({
      product: product._id,
      quantity: faker.number.int({ min: 1, max: 5 }),
    }));

    // Calculate total order amount
    const totalAmount = orderProducts.reduce(
      (sum, item) => {
        const product = products.find((p) => p._id.equals(item.product));
        return sum + item.quantity * product.price;
      },
      0
    );

    // Generate shipping address matching the schema
    const shippingAddress = {
      userName: faker.person.fullName(),
      streetAddress: faker.location.streetAddress(),
      city: faker.location.city(),
      province: faker.location.state(),
      zipCode: faker.location.zipCode(),
    };

    const currency = faker.helpers.arrayElement(currencies);
    const status = faker.helpers.arrayElement(["Ordered", "Delivered", "Cancelled"]);

    const order = new Order({
      user: user._id,
      products: orderProducts,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      currency,
      shippingAddress,
      status,
      orderDate: faker.date.past({ years: 1 }),
    });

    await order.save();
    orders.push(order);

    // Add the order to the user's order history
    user.orderHistory.push(order._id);
    await user.save();
  }

  console.log(`${num} orders seeded`);
};

// Function to clear existing data (optional)
const clearDatabase = async () => {
  try {
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    console.log("Database cleared");
  } catch (err) {
    console.error("Error clearing database:", err);
    throw err;
  }
};

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Optionally clear existing data (uncomment if you want to reset the database)
    // await clearDatabase();
    
    console.log("Starting database seeding...");
    await seedProducts(50); // Seed 50 products
    await seedUsers(20);    // Seed 20 users
    await seedOrders(30);   // Seed 30 orders
    console.log("Database populated successfully");
  } catch (err) {
    console.error("Error populating database:", err);
    process.exit(1);
  } finally {
    // Always disconnect from the database
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the seed script
seedDatabase();
