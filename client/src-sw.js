// Importing required functions and classes from Workbox for caching and routing
const { offlineFallback, warmStrategyCache } = require("workbox-recipes");
const { CacheFirst } = require("workbox-strategies");
const { registerRoute } = require("workbox-routing");
const { CacheableResponsePlugin } = require("workbox-cacheable-response");
const { ExpirationPlugin } = require("workbox-expiration");
const { precacheAndRoute } = require("workbox-precaching/precacheAndRoute");

// Caches and routes files that are part of the generated precache manifest
precacheAndRoute(self.__WB_MANIFEST);

// Defining caching strategy for pages using CacheFirst strategy
const pageCache = new CacheFirst({
  cacheName: "page-cache", // Name of the cache
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200], // Only cache responses with these status codes
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, // Sets max age of cache items to 30 days
    }),
  ],
});

// Warms the pageCache with specific URLs
warmStrategyCache({
  urls: ["/index.html", "/"], // URLs to pre-cache
  strategy: pageCache, // The strategy to apply
});

// Registering a route to handle navigation requests using pageCache strategy
registerRoute(({ request }) => request.mode === "navigate", pageCache);

// Importing StaleWhileRevalidate strategy for handling static resources
const { StaleWhileRevalidate } = require("workbox-strategies");

// Registering a route to handle script and style requests using StaleWhileRevalidate strategy
registerRoute(
  ({ request }) =>
    request.destination === "script" || request.destination === "style",
  new StaleWhileRevalidate({
    cacheName: "static-resources", // Name of the cache for static resources
  })
);

// Registering a route to handle image requests using CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images", // Name of the cache for images
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60, // Max number of entries in the cache
        maxAgeSeconds: 30 * 24 * 60 * 60, // Sets max age of cache items to 30 days
      }),
    ],
  })
);
