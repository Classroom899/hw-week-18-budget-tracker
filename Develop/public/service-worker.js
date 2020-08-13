// const FILES_TO_CACHE = ["/", "/index.html", "app.js", "favicon.ico", "index.js"]; // Generate a list of the files that we want it to cache
const FILES_TO_CACHE = ["/", "/styles.css", "/index.js", "/manifest.webmanifest", "db.js"]; // Generate a list of the files that we want it to cache


const CACHE_NAME = "static-cache-v2"; // Set-up our cache names
const DATA_CACHE_NAME = "data-cache-v1";

// install
self.addEventListener("install", function(evt) { // Add an event listener to the service worker
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Your files were pre-cached successfully!"); // Wait until the cache opens and then cache all of the files
      return cache.addAll(FILES_TO_CACHE); // When we go offline, it will try and pull from the cache 
    })
  );

  self.skipWaiting(); // Don't stall out the website 
});

// activate
self.addEventListener("activate", function(evt) { // Adding an event listener for the activate
  evt.waitUntil( // Check the caches and see if there's anything that has a cache name that does not match one of the two caches that we want to exist 
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key); // Update the name and revalidates the caches - should delete all the existing caches as well 
          }
        })
      );
    })
  );
  self.clients.claim();
});

// fetch
self.addEventListener("fetch", function(evt) {
  // cache successful requests to the API
  if (evt.request.url.includes("/api/")) {
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(evt.request)
          .then(response => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              console.log(response)
              cache.put(evt.request.url, response.clone());
            }

            return response;
          })
          .catch(err => {
            // Network request failed, try to get it from the cache.
            return cache.match(evt.request);
          });
      }).catch(err => console.log(err))
    );

    return; 
  }
  evt.respondWith(
    caches.match(evt.request).then(function(response) {
      return response || fetch(evt.request); // To keep going with this call and find it
    })
  );})


// self.addEventListener("fetch", function(evt) { // Adding an event listener for fetch - This will intercept any fetch requests to the back end 
//   if (evt.request.url.includes("/api/")) {
//     evt.respondWith(
//       caches.open(DATA_CACHE_NAME).then(cache => {
//         return fetch(evt.request)
//           .then(response => {
//             // If the response was good, clone it and store it in the cache.
//             if (response.status === 200) {
//               cache.put(evt.request.url, response.clone());
//             }

//             return response;
//           })
//           .catch(err => {
//             // Network request failed, try to get it from the cache.
//             return cache.match(evt.request); // We are caching any fetch request 
//           });
//       }).catch(err => console.log(err)) // If it fails, use the cache version
//     );

//     return;
// }});
