import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import productRoute from "./routes/productRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";


// ******************
///rest object
const app = express();
//configure dot env file
dotenv.config();
const port = process.env.PORT || 8000;
// database config file
ConnectDB();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//midllerwares
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "./client/dist")));
//routing

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/contact", async (req, res) => {
  try {
    async function main() {
      const { email, message, phone } = req.body;
      if (!email || !message || !phone)
        return res
          .status(400)
          .send({ success: false, message: "Please Enter All Details" });
      const info = await transporter.sendMail({
        from: `${email}`, // sender address
        to: "zriaz9363@gmail.com", // list of receivers
        subject: "Contact US", // Subject line
        html: `
      <h3>Email: ${email} </h3>
      <h3>Phone Number: ${phone} </h3>
      <h6>Message:<br/> ${message} </h6>
      `,
      });

      console.log("Message sent: %s", info.messageId);
    }

    main().catch(console.error);
    res.status(201).send({ success: true, message: "Your Message is Send" });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error in Send Message", error });
  }
});
// rest api
app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/dist/index.html"));
});

//rest api listen terms of Foodpanda
app.listen(port, () => console.log(`Server Running on FoodPanda ${port}`));
