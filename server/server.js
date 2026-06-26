// Zero-dependency standalone mock REST server backed by db.json.
//
// This is an alternative to running `npm run mock` (json-server). It needs no
// node_modules, supports full CRUD, and persists changes back to db.json.
//
//   Usage:  node server.js [--port 4000] [--db db.json]
//
// Collections (arrays in db.json) get REST routes:
//   GET    /users          list (supports ?key=value filtering)
//   GET    /users/:id      single item
//   POST   /users          create (auto-assigns id)
//   PUT    /users/:id      replace
//   PATCH  /users/:id      merge
//   DELETE /users/:id      remove
// Plain objects (e.g. "profile") are served read-only at GET /profile.

const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const PORT = Number(arg("--port", process.env.PORT || 4000));
const DB_PATH = path.resolve(arg("--db", "db.json"));

function loadDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function saveDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2) + "\n");
}

function send(res, status, body) {
  const json = JSON.stringify(body, null, 2);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(json);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

// Loosely compare ids so /users/1 matches both 1 and "1".
const sameId = (a, b) => String(a) === String(b);

const nextId = (collection) =>
  collection.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;

const server = http.createServer(async (req, res) => {

  if (req.method === "OPTIONS") return send(res, 204, {});

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const [resource, id] = url.pathname.split("/").filter(Boolean);

  if (!resource) {
    const db = loadDb();
    return send(res, 200, { resources: Object.keys(db) });
  }

  let db;
  try {
    db = loadDb();
  } catch (e) {
    return send(res, 500, { error: `Could not read ${DB_PATH}: ${e.message}` });
  }

    //added by me below
    //login endpoint
  if (url.pathname === "/auth/login" && req.method === "POST") {
    const body = await readBody(req);

    const user = db.users.find(
      (u) =>
        u.email === body.email &&
        u.password === body.password
    );
    //crud operations handle this for the other endpoints down below
    if (!user) {
      return send(res, 401, {
        message: "Invalid credentials",
      });
    }

    return send(res, 200, {
      token: "fake-jwt-token",
      refreshToken: "fake-refresh-token",
      user,
    });
  }
  //register endpoint
  if (url.pathname === "/auth/register" && req.method === "POST") {
    const body = await readBody(req);

    if (!body.email || !body.password || !body.name) {
      return send(res, 400, {
        message: "Name, email and password are required",
      });
    }

    const existing = db.users.find(
      (u) => u.email === body.email
    );

    if (existing) {
      return send(res, 409, {
        message: "An account with this email already exists",
      });
    }

    const newUser = {
      id: nextId(db.users),
      name: body.name,
      email: body.email,
      password: body.password,
      role: "user",
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(body.email)}`,
    };

    db.users.push(newUser);
    saveDb(db);

    return send(res, 201, {
      token: "fake-jwt-token",
      refreshToken: "fake-refresh-token",
      user: newUser,
    });
  }
  //search endpoint
  if ( url.pathname === "/products/search" && req.method === "GET") {
    const q = (
      url.searchParams.get("q") || ""
    ).toLowerCase();

    const products = db.products.filter(
      (product) =>
       product.title.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q)
    );

    return send(res, 200, products);
  }
/* Categories endpoint to get all unique categories from products 
GET /categories
        │
        ▼
["Shoes", "Shirts", "Watches"]*/
if (
  req.method === "GET" &&
  url.pathname === "/categories"
) {
  const categories = [
    ...new Set(
      db.products.map(
        (product) => product.category
      )
    ),
  ];

  return send(res, 200, categories);
}
  /*category endpoint to get products by category
  GET /products/category/shoes
        │
        ▼
Returns only shoe products


full flow
Open Products Page
        │
        ▼
GET /categories
        │
        ▼
["Shoes", "Shirts", "Watches"]
        │
        ▼
Populate dropdown
        │
        ▼
User selects "Shoes"
        │
        ▼
GET /products/category/shoes
        │
        ▼
Returns only shoe products
*/
  if (
  req.method === "GET" &&
  url.pathname.startsWith("/products/category/")
) {
  const slug =
    url.pathname.split("/")[3];

  const products = db.products.filter(
    (product) =>
      product.category === slug
  );

  return send(res, 200, products);
}
/*user endpoint with id*/
if (
  req.method === "GET" &&
  url.pathname.startsWith("/carts/user/")
) {
  const userId = Number(
    url.pathname.split("/")[3]
  );

  const cart = db.carts.find(
    (cart) => cart.userId === userId
  );

  if (!cart) {
    return send(res, 404, {
      message: "Cart not found"
    });
  }

  return send(res, 200, cart);
}
// Add to cart
if (
  req.method === "POST" &&
  url.pathname === "/carts"
) {
  const body = await readBody(req);

  const newCart = {
    id: db.carts.length + 1,
    ...body,
  };

  db.carts.push(newCart);

  saveDb(db);

  return send(res, 201, newCart);
}
//added by me top

  //crud operations starts from here for products
  if (!(resource in db)) {
    return send(res, 404, { error: `Unknown resource '${resource}'` });
  }


  const data = db[resource];

  // Non-array resource (e.g. "profile") -> read-only single object.
  if (!Array.isArray(data)) {
    if (req.method === "GET") return send(res, 200, data);
    return send(res, 405, { error: `'${resource}' is read-only` });
  }

  try {
    // Collection endpoints (no id)
    if (!id) {
      /*if (req.method === "GET") {
        let items = data;
        for (const [key, value] of url.searchParams) {
          items = items.filter((item) => String(item[key]) === value);
        }
        return send(res, 200, items);
      }*/
     //Added by me below
     //updated get method endpoin to support pagination and filtering
      if (req.method === "GET") {
        let items = data;

        const hasLimit = url.searchParams.has("limit");

        const limit = Number(
          url.searchParams.get("limit")
        );

        const skip = Number(
          url.searchParams.get("skip") || 0
        );

        for (const [key, value] of url.searchParams) {
          if (key === "limit" || key === "skip")
            continue;

          items = items.filter(
            (item) => String(item[key]) === value
          );
        }

        const total = items.length;

        if (hasLimit && !isNaN(limit)) {
          items = items.slice(
            skip,
            skip + limit
          );
        }

        return send(res, 200, {
          products: items,
          total,
          skip,
          limit
        });
      }
      //Added by me top
      if (req.method === "POST") {
        const body = await readBody(req);
        const item = { id: nextId(data), ...body };
        data.push(item);
        saveDb(db);
        return send(res, 201, item);
      }
      return send(res, 405, { error: `Method ${req.method} not allowed` });
    }

    // Item endpoints (with id)
    const index = data.findIndex((item) => sameId(item.id, id));
    if (index === -1) return send(res, 404, { error: `${resource}/${id} not found` });

    if (req.method === "GET") return send(res, 200, data[index]);

    if (req.method === "PUT") {
      const body = await readBody(req);
      data[index] = { ...body, id: data[index].id };
      saveDb(db);
      return send(res, 200, data[index]);
    }
    if (req.method === "PATCH") {
      const body = await readBody(req);
      data[index] = { ...data[index], ...body, id: data[index].id };
      saveDb(db);
      return send(res, 200, data[index]);
    }
    if (req.method === "DELETE") {
      const [removed] = data.splice(index, 1);
      saveDb(db);
      return send(res, 200, removed);
    }
    return send(res, 405, { error: `Method ${req.method} not allowed` });
  } catch (e) {
    return send(res, 400, { error: e.message });
  }
});

server.listen(PORT, () => {
  const db = loadDb();
  console.log(`Mock API server running at http://localhost:${PORT}`);
  console.log(`Serving ${DB_PATH}\n`);
  console.log("Endpoints:");
  for (const key of Object.keys(db)) {
    console.log(`  http://localhost:${PORT}/${key}`);
  }
});
