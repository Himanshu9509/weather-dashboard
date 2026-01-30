// server/db.js

// 1. Import the mongoose library, which is our primary tool for interacting with MongoDB.
import mongoose from 'mongoose';

// 2. Define an asynchronous function to handle the database connection.
//    Using async/await allows us to handle the promise-based nature of database
//    connections in a clean, readable way.
const connectDB = async () => {
  try {
    // 3. The core connection logic. mongoose.connect() attempts to connect to the
    //    database using the connection string. This string is securely accessed
    //    from our environment variables via `process.env.MONGO_URI`.
    //    The `dotenv` package (which we'll call in index.js) makes this possible.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // 4. If the connection is successful, we log a confirmation message to the console.
    //    This is extremely helpful for debugging during development.
    //    `conn.connection.host` will display the host of our database cluster.
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // 5. If an error occurs during connection (e.g., wrong password, network issue),
    //    we catch it here.
    console.error(`Error connecting to MongoDB: ${error.message}`);

    // 6. This is a critical best practice. If the application cannot connect to its
    //    database, it's in a fatal error state and cannot function correctly.
    //    `process.exit(1)` tells Node.js to terminate the entire process with a
    //    "failure" exit code (1). This prevents the server from running in a
    //    broken state.
    process.exit(1);
  }
};

// 7. We export the `connectDB` function as the default export of this module,
//    so it can be imported and used in other parts of our application (specifically, index.js).
export default connectDB;