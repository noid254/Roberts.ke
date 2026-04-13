import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isConfigured = process.env.WOOCOMMERCE_URL && process.env.WOOCOMMERCE_URL !== "https://your-woocommerce-store.com";
let WOO_URL = process.env.WOOCOMMERCE_URL || "https://cms.roberts.co.ke";

// Robust URL handling: Strip /wp-json/wc/v3 or similar if present in the env var
// The WooCommerce SDK expects the site root, not the API endpoint.
WOO_URL = WOO_URL.replace(/\/wp-json\/wc\/v[0-9]+(\/)?$/, "").replace(/\/$/, "");

const WooCommerce = new ((WooCommerceRestApi as any).default || WooCommerceRestApi)({
  url: WOO_URL,
  consumerKey: process.env.WOOCOMMERCE_KEY || "ck_fde2d7f583fd2418d886ec78180349bdc566da7b",
  consumerSecret: process.env.WOOCOMMERCE_SECRET || "cs_c1e220e6d3ab483d798100a849b0f4dc604748c1",
  version: "wc/v3",
  queryStringAuth: true
});

console.log(`WooCommerce initialized for: ${WOO_URL}`);
console.log("Environment check:", {
  url: process.env.WOOCOMMERCE_URL ? "Set" : "Not Set",
  key: process.env.WOOCOMMERCE_KEY ? "Set" : "Not Set",
  secret: process.env.WOOCOMMERCE_SECRET ? "Set" : "Not Set"
});
if (!process.env.WOOCOMMERCE_KEY) {
  console.warn("WARNING: WOOCOMMERCE_KEY not set in environment, using hardcoded fallback.");
}

let cachedProducts: any[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes cache

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Admin Login (Hardcoded for demo as requested)
  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    if (email === "noid254@gmail.com" && password === "12345678") {
      res.json({ success: true, user: { email, role: "admin" } });
    } else {
      res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  });

  // API Routes
  app.get("/api/diagnostics", async (req, res) => {
    const results: any = {
      timestamp: new Date().toISOString(),
      config: {
        url: WOO_URL,
        hasKey: !!process.env.WOOCOMMERCE_KEY,
        hasSecret: !!process.env.WOOCOMMERCE_SECRET,
      },
      tests: []
    };

    const addTest = (name: string, status: 'pass' | 'fail' | 'info', message: string, data?: any) => {
      results.tests.push({ name, status, message, data });
    };

    try {
      // Test 1: Basic Site Reachability
      try {
        const siteCheck = await axios.get(WOO_URL, { timeout: 5000 });
        addTest("Site Reachability", "pass", `Site is up (Status: ${siteCheck.status})`);
      } catch (e: any) {
        addTest("Site Reachability", "fail", `Could not reach site: ${e.message}`);
      }

      // Test 2: API Endpoint Check
      try {
        const apiCheck = await axios.get(`${WOO_URL}/wp-json/wc/v3`, { timeout: 5000 });
        addTest("API Endpoint", "pass", "WooCommerce API endpoint found");
      } catch (e: any) {
        addTest("API Endpoint", "fail", `API endpoint check failed: ${e.message}. Ensure WooCommerce is active and REST API is enabled.`);
      }

      // Test 3: Authentication Test (Direct Axios)
      try {
        const key = process.env.WOOCOMMERCE_KEY || "ck_fde2d7f583fd2418d886ec78180349bdc566da7b";
        const secret = process.env.WOOCOMMERCE_SECRET || "cs_c1e220e6d3ab483d798100a849b0f4dc604748c1";
        const auth = Buffer.from(`${key}:${secret}`).toString('base64');
        
        const authCheck = await axios.get(`${WOO_URL}/wp-json/wc/v3/products`, {
          params: { per_page: 1 },
          headers: { 'Authorization': `Basic ${auth}` },
          timeout: 5000
        });
        addTest("Authentication (Direct)", "pass", `Authenticated successfully. Found ${authCheck.headers['x-wp-total'] || 'unknown'} total products.`);
      } catch (e: any) {
        addTest("Authentication (Direct)", "fail", `Auth failed: ${e.response?.data?.message || e.message}`);
      }

      // Test 4: SDK Test
      try {
        const sdkCheck = await WooCommerce.get("products", { per_page: 1 });
        addTest("SDK Functionality", "pass", `SDK successfully fetched ${sdkCheck.data.length} product(s)`);
      } catch (e: any) {
        addTest("SDK Functionality", "fail", `SDK failed: ${e.response?.data?.message || e.message}`);
      }

      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: "Diagnostics failed", details: error.message, results });
    }
  });

  app.get("/api/products", async (req, res) => {
    const now = Date.now();
    if (cachedProducts.length > 0 && (now - lastFetchTime < CACHE_DURATION)) {
      return res.json(cachedProducts);
    }

    try {
      console.log("Fetching entire catalogue from WooCommerce...");
      
      let allProducts: any[] = [];
      let page = 1;
      let moreProducts = true;
      
      // Fetch products page by page to ensure we get everything
      // and handle cases where x-wp-totalpages might be missing
      while (moreProducts && page <= 10) { // Safety limit of 10 pages (1000 products)
        console.log(`Fetching page ${page}...`);
        const response = await WooCommerce.get("products", {
          per_page: 100,
          status: "publish",
          page: page
        });
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          allProducts = [...allProducts, ...response.data];
          
          // Check if we should continue
          const totalPagesHeader = response.headers?.['x-wp-totalpages'];
          if (totalPagesHeader) {
            const totalPages = parseInt(totalPagesHeader);
            if (page >= totalPages) {
              moreProducts = false;
            } else {
              page++;
            }
          } else {
            // If header is missing, we check if we got a full page
            if (response.data.length < 100) {
              moreProducts = false;
            } else {
              page++;
            }
          }
        } else {
          moreProducts = false;
        }
      }

      if (allProducts.length === 0) {
        console.warn("No products found in WooCommerce.");
        return res.status(404).json({ 
          error: "No products found", 
          details: "The WooCommerce API returned an empty list. Check if you have published products and if your API keys have correct permissions." 
        });
      } else {
        console.log(`Successfully fetched ${allProducts.length} products.`);
        cachedProducts = allProducts;
        lastFetchTime = now;
      }
      
      res.json(allProducts);
    } catch (error: any) {
      const errorData = error.response?.data || error.message || error;
      console.error("Products Fetch Error:", JSON.stringify(errorData, null, 2));
      
      // Provide more specific error messages for common issues
      let userFriendlyError = "Failed to fetch products";
      if (error.code === 'ENOTFOUND') userFriendlyError = "Could not connect to the WooCommerce store URL. Please check the WOOCOMMERCE_URL.";
      if (error.response?.status === 401) userFriendlyError = "Authentication failed. Please check your WooCommerce API Keys.";
      if (error.response?.status === 404) userFriendlyError = "WooCommerce API endpoint not found. Ensure the URL is the root of your WordPress site.";

      res.status(500).json({ 
        error: userFriendlyError, 
        details: errorData,
        config: {
          url: WOO_URL,
          hasKey: !!process.env.WOOCOMMERCE_KEY,
          hasSecret: !!process.env.WOOCOMMERCE_SECRET
        }
      });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const response = await WooCommerce.post("products", req.body);
      res.json(response.data);
    } catch (error: any) {
      console.error("WooCommerce API Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await WooCommerce.put(`products/${id}`, req.body);
      res.json(response.data);
    } catch (error: any) {
      console.error("WooCommerce API Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await WooCommerce.delete(`products/${id}`, { force: true });
      res.json(response.data);
    } catch (error: any) {
      console.error("WooCommerce API Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  app.get("/api/categories", async (req, res) => {
    try {
      const response = await WooCommerce.get("products/categories");
      res.json(response.data);
    } catch (error: any) {
      const errorData = error.response?.data || error.message || error;
      console.error("Categories Fetch Error:", JSON.stringify(errorData, null, 2));
      res.status(500).json({ error: "Failed to fetch categories", details: errorData });
    }
  });

  // Posts (WordPress REST API)
  app.get("/api/posts", async (req, res) => {
    try {
      // Use axios to hit standard WP REST API for posts
      const wpUrl = `${WOO_URL}/wp-json/wp/v2/posts?_embed&per_page=10`;
      const response = await axios.get(wpUrl).catch(() => ({ data: [] }));
      res.json(response.data);
    } catch (error: any) {
      console.error("Posts Fetch Error:", error.message);
      res.json([]); 
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const response = await WooCommerce.post("posts", req.body);
      res.json(response.data);
    } catch (error: any) {
      const errorData = error.response?.data || error.message || error;
      console.error("Post Creation Error:", JSON.stringify(errorData, null, 2));
      res.status(500).json({ error: "Failed to create post", details: errorData });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
