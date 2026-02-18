import mongoose from "mongoose";

const databaseConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
    });
  } catch (error) {
    process.exit(1);
  }
};

export default databaseConnection;
