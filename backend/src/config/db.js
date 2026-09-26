const mongoose = require("mongoose");
const dns = require("dns");

// Override Node's default getaddrinfo lookup ONLY for MongoDB Atlas SRV & shard hostnames
try {
  const origLookup = dns.lookup;
  dns.lookup = function (hostname, options, cb) {
    if (typeof options === "function") {
      cb = options;
      options = {};
    }

    // Only apply custom public DNS for external domains (e.g. MongoDB Atlas *.mongodb.net)
    // Keep internal Docker network hostnames (like 'mongodb') and 'localhost' on default Docker/system DNS
    if (hostname && hostname.includes(".mongodb.net")) {
      const resolver = new dns.Resolver();
      try {
        resolver.setServers(["8.8.8.8", "1.1.1.1"]);
      } catch {}
      resolver.resolve4(hostname, (err, addrs) => {
        if (!err && addrs && addrs.length) {
          if (options && options.all) {
            return cb(
              null,
              addrs.map((a) => ({ address: a, family: 4 }))
            );
          }
          return cb(null, addrs[0], 4);
        }
        origLookup(hostname, options, cb);
      });
      return;
    }

    origLookup(hostname, options, cb);
  };
} catch (e) {
  // Ignore DNS set failures if not supported
}

const connectDB = async () => {
  const primaryUri =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bestroute";
  const localUri = "mongodb://127.0.0.1:27017/bestroute";

  try {
    await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 5000 });
    console.log(
      "MongoDB connected successfully to MongoDB Atlas cloud database"
    );
    return;
  } catch (error) {
    console.warn("Primary MongoDB connection warning:", error.message);
  }

  if (primaryUri !== localUri) {
    try {
      console.log("Attempting fallback connection to local MongoDB...");
      await mongoose.connect(localUri, { serverSelectionTimeoutMS: 5000 });
      console.log("MongoDB connected successfully to local database");
      return;
    } catch (localError) {
      console.warn("Local MongoDB connection warning:", localError.message);
    }
  }

  console.warn(
    "Backend running in resilient mode without active MongoDB instance."
  );
};

module.exports = connectDB;