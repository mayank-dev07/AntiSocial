import mongoose from "mongoose";

const connetDB = async () => {
  try {
    await mongoose.connect(process.env.URI, {});
  } catch (error) {
    // //console.log(error);
  }
};

export default connetDB;
