import mongoose from "mongoose";
const ConnectDB = async () => {
  let conn = await mongoose.connect(`${process.env.Mongo_Url}`);

  try {
    if (conn) {
      console.log(`DataBase connected`);
    }
  } catch (error) {
    console.log(`DataBase Connection Error:${error}`);
  }
};
export default ConnectDB;
