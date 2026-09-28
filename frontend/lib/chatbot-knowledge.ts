import { fallbackDashboardOverview, fallbackProducts, siteConfig } from "@/lib/site";
import { formatPrice, getDiscountPercentage, getStockMessage } from "@/lib/commerce";
import type { Product } from "@/types/domain";

type KnowledgeEntry = {
  id: string;
  title: string;
  type: "project" | "route" | "feature" | "account" | "product" | "admin" | "technical";
  keywords: string[];
  answer: string;
};

type RetrievalDocument = {
  id: string;
  title: string;
  type: KnowledgeEntry["type"] | "category" | "dashboard";
  content: string;
};

type RetrievedDocument = RetrievalDocument & {
  score: number;
};

export type ChatbotReply = {
  answer: string;
  source: "local-rag" | "gemini-rag";
  matchedSources: string[];
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "can",
  "do",
  "does",
  "for",
  "from",
  "give",
  "how",
  "i",
  "in",
  "is",
  "me",
  "my",
  "of",
  "on",
  "please",
  "show",
  "tell",
  "the",
  "to",
  "what",
  "when",
  "where",
  "which",
  "who",
  "with",
  "you",
  "your",
]);

const SPELLING_FIXES: Record<string, string> = {
  ans: "answer",
  anser: "answer",
  chatboat: "chatbot",
  deshboard: "dashboard",
  idenfity: "identify",
  impletement: "implement",
  invetory: "inventory",
  predection: "prediction",
  proudct: "product",
  qsn: "question",
  quesion: "question",
  wroking: "working",
};

const CATEGORY_ALIASES: Record<string, string[]> = {
  "Grocery Essentials": ["grocery", "groceries", "rice", "egg", "eggs", "oil", "food", "pantry"],
  "Home Care": ["home care", "laundry", "detergent", "cleaner", "floor", "cleaning", "home"],
  "Personal Care": ["personal care", "beauty", "shampoo", "face wash", "grooming", "skin", "hair"],
  "Kitchen & Dining": ["kitchen", "dining", "cookware", "pan", "blender", "lunch box", "appliance"],
  "Electronics & Gadgets": ["electronics", "gadgets", "power bank", "lantern", "mobile", "tech"],
  "Fashion & Lifestyle": ["fashion", "lifestyle", "panjabi", "sandals", "footwear", "menswear"],
};

const PROJECT_DATABASE: KnowledgeEntry[] = [
  {
    id: "project-overview",
    title: "Project overview",
    type: "project",
    keywords: ["about", "project", "smart commerce", "ecommerce", "marketplace", "unique", "features"],
    answer: `${siteConfig.name} is a smart multi-role e-commerce platform. It includes a storefront, cart, checkout, customer order tracking, admin analytics, vendor product management, low-stock vendor alerts, demand forecasting, PDF order receipts, audit activity, and role-based dashboards.`,
  },
  {
    id: "customer-flow",
    title: "Customer shopping flow",
    type: "route",
    keywords: ["customer", "buy", "purchase", "cart", "checkout", "confirm order", "order flow"],
    answer:
      "Customer flow: browse products at /products, add items to cart, open /cart, continue to /checkout, enter delivery details, choose payment, and click Confirm order. After confirmation, a PDF receipt downloads and an order confirmation window opens.",
  },
  {
    id: "pdf-receipt",
    title: "PDF receipt",
    type: "feature",
    keywords: ["pdf", "receipt", "invoice", "download", "confirm order", "price"],
    answer:
      "After the customer clicks Confirm order, the checkout generates a PDF receipt with order number, customer details, delivery address, ordered products, item prices, shipping fee, and total price.",
  },
  {
    id: "admin-dashboard",
    title: "Admin dashboard",
    type: "admin",
    keywords: ["admin", "dashboard", "overview", "kpi", "revenue", "audit", "analytics"],
    answer:
      "Admins use /admin to view KPIs, revenue chart, below-stock product alerts, recent orders, audit activity, and top products. Sidebar modules include Orders, Customers, Vendors, Inventory, Low-stock product, Demand forecast, and Catalog.",
  },
  {
    id: "vendor-dashboard",
    title: "Vendor dashboard",
    type: "route",
    keywords: ["vendor", "seller", "vendor dashboard", "add product", "manage product", "vendor orders"],
    answer:
      "Vendors use /vendor to view overview stats, /vendor/products to manage products, /vendor/products/new to add products, /vendor/inventory to update stock, and /vendor/orders to review order status.",
  },
  {
    id: "customer-dashboard",
    title: "Customer dashboard",
    type: "route",
    keywords: ["customer dashboard", "track order", "order history", "profile"],
    answer:
      "Customers use their dashboard to view order history and track order progress. Order statuses include pending, processing, shipped, delivered, and cancelled.",
  },
  {
    id: "inventory",
    title: "Inventory intelligence",
    type: "feature",
    keywords: ["inventory", "stock", "adjust", "warehouse", "quantity", "reorder", "inventory intelligence"],
    answer:
      "Inventory Intelligence stores each product's stock and reorder point, shows in-stock, low-stock, and out-of-stock statuses, supports stock adjustment, and stores inventory logs with previous stock, new stock, quantity change, reason, and user information.",
  },
  {
    id: "low-stock",
    title: "Low-stock alert",
    type: "feature",
    keywords: ["low stock", "below stock", "stock alert", "vendor name", "out of stock", "inventory alert"],
    answer:
      "Low-stock alert is generated by comparing current stock with a reorder point or alert threshold. If stock is 0, the product is out of stock. If stock is less than or equal to the reorder point, it is marked as low stock. The admin low-stock module also highlights products below 7 units.",
  },
  {
    id: "stock-notification-tech",
    title: "Low-stock notification technologies",
    type: "technical",
    keywords: ["notification", "identify low stock", "technology", "badge", "toast"],
    answer:
      "Low stock is identified with MongoDB, Mongoose, Node.js, Express.js, and TypeScript. The frontend notification is shown with Next.js, React, Tailwind CSS, dashboard alert lists, badge components, and toast messages after stock updates.",
  },
  {
    id: "demand-forecast",
    title: "Demand forecast",
    type: "feature",
    keywords: ["demand", "forecast", "prediction", "future", "chart", "python", "nlp", "sell most"],
    answer:
      "The Demand forecast module is at /admin/demand-forecast. The backend reads active products and non-cancelled orders, groups sales by product into weekly buckets, sends the history to a Python script, and returns predicted units, trend label, keywords, confidence score, and future forecast values.",
  },
  {
    id: "forecast-tech",
    title: "Demand forecasting technology",
    type: "technical",
    keywords: ["forecast technology", "weighted average", "trend", "confidence", "recharts"],
    answer:
      "Demand forecasting uses Node.js, Express.js, TypeScript, MongoDB, Mongoose, a Python forecasting script, Next.js, React, and Recharts. The Python logic uses weighted average, trend analysis, keyword boost, and confidence scoring. It is explainable forecasting, not deep learning.",
  },
  {
    id: "orders",
    title: "Orders",
    type: "feature",
    keywords: ["order", "orders", "status", "tracking", "pending", "processing", "shipped", "delivered"],
    answer:
      "Orders support statuses pending, processing, shipped, delivered, and cancelled. Customers can view their orders from /dashboard/orders, while admins and vendors manage orders from their dashboard order pages.",
  },
  {
    id: "auth-roles",
    title: "Authentication and roles",
    type: "technical",
    keywords: ["login", "auth", "authentication", "authorization", "role", "jwt", "bcrypt"],
    answer:
      "The project uses role-based access control. The backend verifies login with bcrypt, returns a JWT token, and protects admin, vendor, and customer routes with authentication and authorization middleware.",
  },
  {
    id: "demo-accounts",
    title: "Demo accounts",
    type: "account",
    keywords: ["login", "demo", "account", "password", "credentials", "email"],
    answer:
      "Demo accounts: Admin uses admin@smartcommerce.local / Admin12345. Vendor uses vendor@smartcommerce.local / Vendor1234. Customer uses customer@smartcommerce.local / Customer123.",
  },
  {
    id: "tech-stack",
    title: "Technology stack",
    type: "project",
    keywords: ["technology", "tech stack", "next", "react", "express", "mongodb", "mongoose", "docker", "typescript"],
    answer:
      "The frontend uses Next.js, React, TypeScript, Tailwind CSS, Recharts, Lucide icons, jsPDF, and Sonner notifications. The backend uses Node.js, Express, TypeScript, MongoDB with Mongoose, JWT authentication, bcrypt, Zod, Helmet, CORS, Morgan, rate limiting, Docker, and a Python script for demand forecast analysis.",
  },
  {
    id: "chatbot",
    title: "AI customer support chatbot",
    type: "feature",
    keywords: ["chatbot", "chat", "answer", "question", "rag", "gemini", "database", "support"],
    answer:
      "The chatbot works as an AI-style customer support assistant. It retrieves relevant context from project knowledge, product data, categories, dashboard metrics, and inventory alerts, then generates a helpful answer. It can also use Gemini API for RAG-based generation when GEMINI_API_KEY is configured; otherwise it uses the local retrieval answer.",
  },
  {
    id: "rag",
    title: "RAG chatbot design",
    type: "technical",
    keywords: ["rag", "retrieval", "augmented", "generation", "gemini api", "chroma", "vector"],
    answer:
      "RAG means Retrieval-Augmented Generation. The chatbot first retrieves relevant project or product context, then generates an answer from that context. ChromaDB is not mandatory; retrieval can use MongoDB, JSON/text data, vector search, FAISS, Pinecone, pgvector, or MongoDB Atlas Vector Search.",
  },
  {
    id: "run-project",
    title: "Run project",
    type: "project",
    keywords: ["run", "start", "setup", "docker", "install", "localhost", "seed"],
    answer:
      "Run the project with Docker Compose or separate frontend/backend commands. The frontend is usually at http://localhost:3000 and the backend API at http://localhost:5000. Use the seed script to create demo roles, users, categories, products, and orders.",
  },
];

function normalize(value: string) {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9\s.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned
    .split(" ")
    .map((word) => SPELLING_FIXES[word] ?? word)
    .join(" ");
}

function stem(token: string) {
  if (token.length > 5 && token.endsWith("ing")) return token.slice(0, -3);
  if (token.length > 4 && token.endsWith("ed")) return token.slice(0, -2);
  if (token.length > 4 && token.endsWith("es")) return token.slice(0, -2);
  if (token.length > 3 && token.endsWith("s")) return token.slice(0, -1);
  return token;
}

function tokenize(value: string) {
  return normalize(value)
    .split(" ")
    .map(stem)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function includesAny(value: string, keywords: string[]) {
  const normalizedValue = normalize(value);
  return keywords.some((keyword) => normalizedValue.includes(normalize(keyword)));
}

function normalizedWords(value: string) {
  return new Set(normalize(value).split(" ").filter(Boolean));
}

function hasWordOrPhrase(message: string, value: string) {
  const normalizedMessage = normalize(message);
  const normalizedValue = normalize(value);
  if (!normalizedValue) return false;

  if (!normalizedValue.includes(" ")) {
    return normalizedWords(message).has(normalizedValue);
  }

  return new RegExp(`(^|\\s)${normalizedValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`).test(normalizedMessage);
}

function scoreText(query: string, target: string) {
  const normalizedQuery = normalize(query);
  const normalizedTarget = normalize(target);
  const queryTokens = tokenize(query);
  const targetTokens = new Set(tokenize(target));
  let score = 0;

  if (normalizedTarget.includes(normalizedQuery)) score += 14;

  for (const token of queryTokens) {
    if (targetTokens.has(token)) {
      score += token.length > 5 ? 4 : 3;
      continue;
    }

    if (normalizedTarget.includes(token)) {
      score += token.length > 5 ? 2 : 1;
    }
  }

  return score;
}

function productSearchText(product: Product) {
  return [
    product.name,
    product.sku,
    product.slug,
    product.description,
    product.category?.name,
    product.category?.slug,
    ...product.tags,
  ]
    .filter(Boolean)
    .join(" ");
}

function formatProductInfo(product: Product) {
  const discount = getDiscountPercentage(product);
  const compareAt = product.compareAtPrice ? `, was ${formatPrice(product.compareAtPrice)}` : "";
  const discountText = discount > 0 ? ` (${discount}% off)` : "";

  return [
    `${product.name}`,
    `SKU: ${product.sku}`,
    `Category: ${product.category?.name ?? "Uncategorized"}`,
    `Price: ${formatPrice(product.price)}${compareAt}${discountText}`,
    `Stock: ${product.stock} units - ${getStockMessage(product)}`,
    `Reorder point: ${product.reorderPoint} units`,
    `Rating: ${product.rating}/5`,
    `30-day sales: ${product.metrics.sales30d}, views: ${product.metrics.views30d}, conversion: ${product.metrics.conversionRate}%`,
    `Details: ${product.description}`,
  ].join("\n");
}

function formatProductList(products: Product[], heading: string) {
  if (!products.length) return `${heading}\nNo matching products were found in the current project data.`;

  return [
    heading,
    ...products.map((product) => {
      const discount = getDiscountPercentage(product);
      const discountText = discount > 0 ? `, ${discount}% off` : "";
      return `- ${product.name}: ${formatPrice(product.price)} (${getStockMessage(product)}, stock ${product.stock}, sold ${product.metrics.sales30d} in 30 days${discountText})`;
    }),
  ].join("\n");
}

function extractBudget(message: string) {
  const normalizedMessage = normalize(message);
  const match = normalizedMessage.match(/(?:under|below|less than|max|maximum|within|budget)\s+(?:tk|bdt|usd|dollar|taka|৳|\$)?\s*(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

function getCategoryFromMessage(message: string) {
  return Object.entries(CATEGORY_ALIASES).find(([categoryName, aliases]) => {
    return hasWordOrPhrase(message, categoryName) || aliases.some((alias) => hasWordOrPhrase(message, alias));
  })?.[0];
}

function getBestProduct(message: string) {
  return fallbackProducts
    .map((product) => ({ product, score: scoreText(message, productSearchText(product)) }))
    .sort((a, b) => b.score - a.score)[0];
}

function answerProductQuestion(message: string) {
  const normalizedMessage = normalize(message);
  const words = normalizedWords(message);
  const hasProductIntent = includesAny(normalizedMessage, [
    "product",
    "price",
    "stock",
    "available",
    "availability",
    "discount",
    "sale",
    "offer",
    "featured",
    "popular",
    "category",
    "categories",
    "sell",
    "buy",
    "cheap",
    "expensive",
    "highest",
    "lowest",
    "top",
    "most sold",
    "highest demand",
    "grocery",
    "rice",
    "egg",
    "oil",
    "detergent",
    "shampoo",
    "blender",
    "power bank",
    "lantern",
    "panjabi",
    "sandals",
  ]);

  if (!hasProductIntent) return null;

  const budget = extractBudget(normalizedMessage);
  if (budget !== null) {
    const products = fallbackProducts
      .filter((product) => product.price <= budget)
      .sort((a, b) => a.price - b.price)
      .slice(0, 8);

    return formatProductList(products, `Products within ${formatPrice(budget)}:`);
  }

  const wantsOffers = normalizedMessage.includes("discount") || normalizedMessage.includes("offer") || words.has("sale");
  if (wantsOffers) {
    const products = fallbackProducts
      .filter((product) => getDiscountPercentage(product) > 0)
      .sort((a, b) => getDiscountPercentage(b) - getDiscountPercentage(a))
      .slice(0, 8);

    return formatProductList(products, "Current discounted products:");
  }

  if (normalizedMessage.includes("low stock") || normalizedMessage.includes("below stock")) {
    const products = fallbackProducts
      .filter((product) => product.stock <= product.reorderPoint)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 8);

    return formatProductList(products, "Products at or below their reorder point:");
  }

  if (normalizedMessage.includes("out of stock")) {
    const products = fallbackProducts.filter((product) => product.stock === 0);
    return formatProductList(products, "Out-of-stock products:");
  }

  if (
    normalizedMessage.includes("popular") ||
    normalizedMessage.includes("top") ||
    normalizedMessage.includes("most sold") ||
    normalizedMessage.includes("highest demand")
  ) {
    const products = [...fallbackProducts].sort((a, b) => b.metrics.sales30d - a.metrics.sales30d).slice(0, 6);
    return formatProductList(products, "Top products by 30-day sales:");
  }

  if (normalizedMessage.includes("featured")) {
    return formatProductList(fallbackProducts.filter((product) => product.featured).slice(0, 8), "Featured products:");
  }

  const bestProduct = getBestProduct(message);
  if (bestProduct && bestProduct.score >= 6) {
    return formatProductInfo(bestProduct.product);
  }

  if (normalizedMessage.includes("cheap") || normalizedMessage.includes("lowest price")) {
    const products = [...fallbackProducts].sort((a, b) => a.price - b.price).slice(0, 6);
    return formatProductList(products, "Lowest priced products:");
  }

  if (normalizedMessage.includes("expensive") || normalizedMessage.includes("highest price")) {
    const products = [...fallbackProducts].sort((a, b) => b.price - a.price).slice(0, 6);
    return formatProductList(products, "Highest priced products:");
  }

  if (normalizedMessage.includes("category") || normalizedMessage.includes("what do you sell")) {
    const categories = [...new Set(fallbackProducts.map((product) => product.category?.name).filter(Boolean))];
    return `Smart Commerce sells products in these categories:\n${categories.map((category) => `- ${category}`).join("\n")}`;
  }

  const category = getCategoryFromMessage(message);
  if (category) {
    return formatProductList(
      fallbackProducts.filter((product) => product.category?.name === category),
      `${category} products:`,
    );
  }

  if (bestProduct && bestProduct.score >= 4) {
    return formatProductInfo(bestProduct.product);
  }

  if (["product", "price", "stock", "available"].some((keyword) => normalizedMessage.includes(keyword))) {
    return formatProductList(fallbackProducts.slice(0, 10), "Available products:");
  }

  return null;
}

function answerStatsQuestion(message: string) {
  const normalizedMessage = normalize(message);

  if (!normalizedMessage.includes("dashboard") && !normalizedMessage.includes("metric") && !normalizedMessage.includes("low stock")) {
    return null;
  }

  const wantsCurrentAlerts = includesAny(normalizedMessage, ["current", "list", "show", "which", "alert list", "low stock products"]);
  if (normalizedMessage.includes("low stock") && wantsCurrentAlerts) {
    return [
      "Current dashboard low-stock alerts:",
      ...fallbackDashboardOverview.inventoryAlerts.map(
        (alert) =>
          `- ${alert.name} by ${alert.vendorName}: stock ${alert.stock}, alert threshold ${alert.threshold ?? alert.reorderPoint}, suggested restock ${alert.recommendedOrderQty}, urgency ${alert.urgency}`,
      ),
    ].join("\n");
  }

  if (normalizedMessage.includes("low stock")) {
    return null;
  }

  return [
    "Admin dashboard sample metrics:",
    ...fallbackDashboardOverview.kpis.map((metric) => `- ${metric.label}: ${metric.value} (${metric.delta})`),
    `- Recent orders shown: ${fallbackDashboardOverview.recentOrders.length}`,
    `- Inventory alerts shown: ${fallbackDashboardOverview.inventoryAlerts.length}`,
  ].join("\n");
}

function answerProjectQuestion(message: string) {
  const normalizedMessage = normalize(message);
  const asksForecastTechnology =
    normalizedMessage.includes("forecast") && includesAny(normalizedMessage, ["technology", "technologies", "tech", "used", "use"]);

  if (asksForecastTechnology) {
    return PROJECT_DATABASE.find((entry) => entry.id === "forecast-tech")?.answer ?? null;
  }

  const hasProjectIntent = includesAny(normalizedMessage, [
    "project",
    "feature",
    "unique",
    "dashboard",
    "admin",
    "vendor",
    "customer",
    "checkout",
    "order",
    "pdf",
    "receipt",
    "invoice",
    "low stock",
    "below stock",
    "demand",
    "forecast",
    "prediction",
    "python",
    "chatbot",
    "rag",
    "gemini",
    "login",
    "account",
    "technology",
    "tech",
    "run",
    "setup",
    "docker",
    "inventory intelligence",
  ]);

  if (!hasProjectIntent) return null;

  const bestEntry = PROJECT_DATABASE.map((entry) => ({
    entry,
    score:
      scoreText(message, `${entry.title} ${entry.keywords.join(" ")}`) * 2 +
      scoreText(message, entry.answer),
  })).sort((a, b) => b.score - a.score)[0];

  if (bestEntry && bestEntry.score >= 8) {
    return bestEntry.entry.answer;
  }

  return null;
}

function buildProductDocuments(): RetrievalDocument[] {
  const productDocs = fallbackProducts.map((product) => ({
    id: `product-${product.id}`,
    title: product.name,
    type: "product" as const,
    content: [
      formatProductInfo(product),
      `Tags: ${product.tags.join(", ")}`,
      `Featured: ${product.featured ? "yes" : "no"}`,
    ].join("\n"),
  }));

  const categoryDocs = Object.keys(CATEGORY_ALIASES).map((categoryName) => {
    const products = fallbackProducts.filter((product) => product.category?.name === categoryName);
    const stock = products.reduce((sum, product) => sum + product.stock, 0);
    const sales = products.reduce((sum, product) => sum + product.metrics.sales30d, 0);
    const productNames = products.map((product) => product.name).join(", ");

    return {
      id: `category-${normalize(categoryName).replace(/\s+/g, "-")}`,
      title: `${categoryName} category`,
      type: "category" as const,
      content: `${categoryName} includes ${products.length} products: ${productNames}. Total stock: ${stock}. Total 30-day sales: ${sales}.`,
    };
  });

  return [...productDocs, ...categoryDocs];
}

function buildDashboardDocuments(): RetrievalDocument[] {
  return [
    {
      id: "dashboard-kpis",
      title: "Dashboard KPIs",
      type: "dashboard",
      content: [
        "Admin dashboard KPIs:",
        ...fallbackDashboardOverview.kpis.map((metric) => `${metric.label}: ${metric.value}, change ${metric.delta}`),
      ].join("\n"),
    },
    {
      id: "dashboard-low-stock",
      title: "Dashboard low-stock alerts",
      type: "dashboard",
      content: [
        "Low-stock dashboard alerts:",
        ...fallbackDashboardOverview.inventoryAlerts.map(
          (alert) =>
            `${alert.name} by ${alert.vendorName}, SKU ${alert.sku}, stock ${alert.stock}, threshold ${alert.threshold ?? alert.reorderPoint}, recommended restock ${alert.recommendedOrderQty}, urgency ${alert.urgency}`,
        ),
      ].join("\n"),
    },
    {
      id: "dashboard-top-products",
      title: "Dashboard top products",
      type: "dashboard",
      content: [
        "Top product insights:",
        ...fallbackDashboardOverview.topProducts.map(
          (product) =>
            `${product.name}: 30-day sales ${product.sales30d}, views ${product.views30d}, conversion ${product.conversionRate}%, stock ${product.stock}`,
        ),
      ].join("\n"),
    },
  ];
}

function buildKnowledgeDocuments(): RetrievalDocument[] {
  return [
    ...PROJECT_DATABASE.map((entry) => ({
      id: entry.id,
      title: entry.title,
      type: entry.type,
      content: `${entry.title}\nKeywords: ${entry.keywords.join(", ")}\n${entry.answer}`,
    })),
    ...buildProductDocuments(),
    ...buildDashboardDocuments(),
  ];
}

function retrieveDocuments(question: string, limit = 5) {
  return buildKnowledgeDocuments()
    .map((doc) => ({ ...doc, score: scoreText(question, `${doc.title}\n${doc.content}`) }))
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function synthesizeLocalAnswer(question: string, documents: RetrievedDocument[]) {
  if (!documents.length || documents[0].score < 4) {
    return [
      "I could not find an exact match in the current Smart Commerce data. You can ask about:",
      "- product price, stock, categories, discounts, featured products, or top-selling products",
      "- checkout, PDF receipt, order tracking, payment, or user roles",
      "- admin, vendor, and customer dashboards",
      "- inventory intelligence, low-stock alerts, and demand forecasting",
      "- chatbot RAG/Gemini design, demo accounts, technology stack, or setup",
    ].join("\n");
  }

  const exactProjectDoc = documents.find((doc) => PROJECT_DATABASE.some((entry) => entry.id === doc.id) && doc.score >= 9);
  if (exactProjectDoc) {
    const entry = PROJECT_DATABASE.find((item) => item.id === exactProjectDoc.id);
    if (entry) return entry.answer;
  }

  const contextLines = documents.slice(0, 4).map((doc) => `- ${doc.title}: ${doc.content.split("\n").slice(0, 4).join(" ")}`);

  return [
    "Based on the available Smart Commerce project data:",
    ...contextLines,
    "",
    `For your question "${question}", these are the most relevant project records. The chatbot retrieves matching project/product context first, then answers from that context.`,
  ].join("\n");
}

async function generateWithGemini(question: string, documents: RetrievedDocument[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !documents.length) return null;

  const model = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";
  const context = documents
    .map((doc, index) => `Source ${index + 1}: ${doc.title}\n${doc.content}`)
    .join("\n\n");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: [
                  "You are the Smart Commerce customer support chatbot.",
                  "Answer only from the provided project and product context.",
                  "If the answer is not in context, say what information is available and suggest a related question.",
                  "Keep the answer concise and helpful.",
                  "",
                  `Question: ${question}`,
                  "",
                  "Context:",
                  context,
                ].join("\n"),
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    return payload.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join("\n").trim() || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function answerChatbotQuestion(question: string): Promise<ChatbotReply> {
  const trimmedQuestion = question.trim();

  if (!trimmedQuestion) {
    return {
      answer: "Please type a question about products, orders, dashboards, inventory, low stock, demand forecast, accounts, or setup.",
      source: "local-rag",
      matchedSources: [],
    };
  }

  const statsAnswer = answerStatsQuestion(trimmedQuestion);
  const productAnswer = answerProductQuestion(trimmedQuestion);
  const projectAnswer = answerProjectQuestion(trimmedQuestion);
  const normalizedQuestion = normalize(trimmedQuestion);
  const explanatoryQuestion = includesAny(normalizedQuestion, [
    "how",
    "why",
    "what is",
    "what mean",
    "technology",
    "technologies",
    "used",
    "use",
    "implement",
    "work",
    "given",
    "identify",
    "necessary",
  ]);
  const catalogQuestion =
    extractBudget(trimmedQuestion) !== null ||
    includesAny(normalizedQuestion, [
      "which product",
      "products under",
      "product price",
      "stock price",
      "available product",
      "category",
      "discount",
      "offer",
      "cheap",
      "expensive",
      "featured",
      "popular",
      "most sold",
      "fastcharge",
      "rice",
      "egg",
      "oil",
      "detergent",
      "shampoo",
      "blender",
      "power bank",
      "lantern",
      "panjabi",
      "sandals",
    ]);
  const directAnswer = statsAnswer ?? (explanatoryQuestion && !catalogQuestion ? projectAnswer ?? productAnswer : productAnswer ?? projectAnswer);
  const retrievedDocuments = retrieveDocuments(trimmedQuestion);
  const matchedSources = retrievedDocuments.map((doc) => doc.title);

  if (directAnswer) {
    return {
      answer: directAnswer,
      source: "local-rag",
      matchedSources,
    };
  }

  const geminiAnswer = await generateWithGemini(trimmedQuestion, retrievedDocuments);
  if (geminiAnswer) {
    return {
      answer: geminiAnswer,
      source: "gemini-rag",
      matchedSources,
    };
  }

  return {
    answer: synthesizeLocalAnswer(trimmedQuestion, retrievedDocuments),
    source: "local-rag",
    matchedSources,
  };
}
