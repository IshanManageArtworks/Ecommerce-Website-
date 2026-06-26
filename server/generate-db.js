const fs = require("fs");

const categories = [
  { id: 1, slug: "electronics", name: "Electronics" },
  { id: 2, slug: "fashion", name: "Fashion" },
  { id: 3, slug: "books", name: "Books" },
  { id: 4, slug: "home", name: "Home" },
  { id: 5, slug: "sports", name: "Sports" },
];

const brands = {
  electronics: ["Apple", "Samsung", "Sony", "Dell", "HP"],
  fashion: ["Nike", "Adidas", "Puma", "Levis", "Zara"],
  books: ["Penguin", "OReilly", "Packt", "Pearson"],
  home: ["Ikea", "Milton", "Prestige", "HomeCentre"],
  sports: ["Nivia", "Yonex", "Decathlon", "Puma"],
};

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(arr) {
  return arr[random(0, arr.length - 1)];
}

function createUsers() {
  const users = [];

  for (let i = 1; i <= 10; i++) {
    users.push({
      id: i,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      password: "123456",
      role: i === 1 ? "admin" : "user",
      avatar: `https://i.pravatar.cc/150?img=${i}`,
    });
  }

  return users;
}

function createProducts() {
  const products = [];

  let id = 1;

  categories.forEach((category) => {
    for (let i = 1; i <= 50; i++) {
      products.push({
        id: id++,
        title: `${category.name} Product ${i}`,
        description: `Premium ${category.name.toLowerCase()} item ${i}`,
        price: random(500, 80000),
        discountPercentage: random(5, 30),
        rating: Number((Math.random() * 2 + 3).toFixed(1)),
        stock: random(5, 100),
        brand: randomItem(brands[category.slug]),
        category: category.slug,
        thumbnail: `https://picsum.photos/400?random=${id}`,
        createdAt: new Date(
          Date.now() - random(1, 365) * 86400000
        ).toISOString(),
      });
    }
  });

  return products;
}

function createReviews(products) {
  const reviews = [];

  for (let i = 1; i <= 500; i++) {
    reviews.push({
      id: i,
      productId: random(1, products.length),
      userId: random(1, 10),
      rating: random(1, 5),
      comment: `Review ${i} for product`,
    });
  }

  return reviews;
}

function createCarts() {
  const carts = [];

  for (let i = 1; i <= 10; i++) {
    carts.push({
      id: i,
      userId: i,
      products: [
        {
          productId: random(1, 100),
          quantity: random(1, 3),
        },
        {
          productId: random(1, 100),
          quantity: random(1, 3),
        },
      ],
    });
  }

  return carts;
}

function createOrders() {
  const statuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const orders = [];

  for (let i = 1; i <= 30; i++) {
    orders.push({
      id: i,
      userId: random(1, 10),
      products: [
        {
          productId: random(1, 100),
          quantity: random(1, 3),
        },
      ],
      total: random(1000, 100000),
      status: randomItem(statuses),
      createdAt: new Date().toISOString(),
    });
  }

  return orders;
}

function createNotifications() {
  const notifications = [];

  for (let i = 1; i <= 20; i++) {
    notifications.push({
      id: i,
      userId: random(1, 10),
      message: `Notification ${i}`,
      read: Math.random() > 0.5,
      createdAt: new Date().toISOString(),
    });
  }

  return notifications;
}

function createTodos() {
  const todos = [];

  for (let i = 1; i <= 20; i++) {
    todos.push({
      id: i,
      title: `Todo ${i}`,
      completed: Math.random() > 0.5,
    });
  }

  return todos;
}

const products = createProducts();

const db = {
  users: createUsers(),
  categories,
  products,
  reviews: createReviews(products),
  carts: createCarts(),
  orders: createOrders(),
  notifications: createNotifications(),
  todos: createTodos(),
  profile: {
    name: "E-Commerce Dashboard API",
    version: "1.0.0",
  },
};

fs.writeFileSync(
  "db.json",
  JSON.stringify(db, null, 2)
);

console.log("✅ db.json generated successfully");
console.log(`Products: ${products.length}`);