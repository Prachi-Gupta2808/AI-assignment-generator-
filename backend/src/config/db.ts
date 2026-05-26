import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    console.log("Starting MongoDB connection...");

    console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

    console.log("Attempting mongoose.connect()");

    const conn = await mongoose.connect(process.env.MONGO_URI as string);

    console.log("MongoDB Connected");
    console.log("Host:", conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection failed");
    console.error(error);

    process.exit(1);
  }
};

export default connectDB;
