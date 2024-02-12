import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "confortzoneuk@gmail.com",
    pass: "kkwocpwjgmgyjdym",
  },
});
// resgistertaion
export const userRegisterController = async (req, res) => {
  try {
    const {
      name,
      password,
      email,
      phone,
      resetToken,
    
    } = req.body;

    if (!resetToken) {
      return res.send({ message: "Reset Token is Required" });
    }
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
   
    if (!password) {
      return res.send({ message: "password is Required" });
    }
    if (password.length < 8) {
      return res.send({ message: "password Al_least 8 characters" });
    }
    if (!email) {
      return res.send({ message: "email is Required" });
    }
    if (!phone) {
      return res.send({ message: "phone is Required" });
    }
  
    //for existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(200)
        .send({ success: false, message: "Already Registered please Login" });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save new user
    let userSave = await new userModel({
      name,
      password: hashedPassword,
      email,
      phone,
     
      resetToken,
         }).save();
    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      userSave,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Problem in Registration", error });
  }
};

// resgistertaion;

export const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(500)
        .send({ success: false, message: "Invalid Email & Password", error });
    }

    //validation check
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email",
      });
    }

    let matchPassword = await comparePassword(password, user.password);
    if (!matchPassword) {
      return res.status(200).send({
        success: false,
        message: "invalid Password",
      });
    }
    //token gerate
    let token = await jwt.sign({ _id: user._id }, process.env.JWT_Token, {
      expiresIn: "7d",
    });

    res.status(201).send({
      success: true,
      message: "Login Successfully",
      token,
     user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
        
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Problem in Login", error });
  }
};

export const tokenRequireController = async (req, res) => {
  res.send("Protected route by token successful");
};


export const otpRequestController = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email);
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }

    //check
    let existUser = await userModel.findOne({email});
    // console.log(existUser)
    if (!existUser) {
      res
        .status(404)
        .send({ success: false, message: "Invalid Email" });
    }
    if (existUser){
async function main() {
    const info = await transporter.sendMail({
      from: "confortzoneuk@gmail.com",
      to: `${existUser?.email}`, 

      subject: "FoodPanda Reset OTP",
      
      html: `
      
      <h2>
 Your OTP ${existUser?.resetToken} is Secret Never Share AnyOne
    </h2>`});

    console.log("Message sent: %s", info.messageId);
  }

  main().catch(console.error);
  res.status(201).send({ success: true, message: "OTP Send Successfully "})
}
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "something went wrong", error });
  }
};
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, confirmPassword, resetToken } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!confirmPassword) {
      res.status(400).send({ message: "Password is required" });
    }
    if (!resetToken) {
      res.status(400).send({ message: "OTP is required" });
    }
    //check
    let existUser = await userModel.findOne({ email, resetToken });
    if (!existUser) {
      res
        .status(404)
        .send({ success: false, message: "Invalid Email or OTP" });
    }
    const PasswordHashing = await hashPassword(confirmPassword);
    
  const user=  await userModel.findByIdAndUpdate(existUser._id, {
      password: PasswordHashing,resetToken:Math.floor(Math.random() * (300 * 1000))
    });
    res
      .status(200)
      .send({ success: true, message: "Password Reset Successfully " ,user});
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "something went wrong", error });
  }
};

export const userUpdateController = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, phone, email } = req.body;

  
    let updateUser = await userModel.findByIdAndUpdate(
      id,
      {
        name: name || ExistUser.name,
        phone: phone || ExistUser.phone,
      email:email||ExistUser.email,
      },
      { new: true }
    );
// console.log(updateUser)
    res.status(201).send({
      success: true,
      message: `Update ${updateUser.name} Successfully`,
      updateUser,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error in Updating user", error });
  }
};

export const userPasswordUpdateController = async (req, res) => {
  try {
    const { id } = req.params;

    // Assuming you're fetching the user by ID
    const existUser = await userModel.findById(id);

    if (!existUser) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    const { password, confirmPassword } = req.body;

    if (password && password.length < 8) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    if (confirmPassword && confirmPassword.length < 8) {
      return res.status(400).send({
        success: false,
        message: "New Password must be at least 8 characters",
      });
    }

    const currentPasswordHash = await hashPassword(password);
    const isCurrentPasswordCorrect = await comparePassword(password, existUser.password);

    if (!isCurrentPasswordCorrect) {
      return res.status(201).send({ success: false, message: "Current password is wrong" });
    }

    // Hash the new password before updating
    const newPasswordHash = await hashPassword(confirmPassword);

    // Update the user's password
    existUser.password = newPasswordHash;

    // Save the updated user document
    await existUser.save();

    res.status(200).send({
      success: true,
      message: `${existUser.name}'s password updated successfully`,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error in updating password", error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const result = await userModel.find({}).sort({ createdAt: -1 });
    if (result) {
      res
        .status(201)
        .send({ success: true, message: "Get users Successfully", result });
    }
  } catch (error) {
    res
      .status(500)
      .send({ error, success: false, message: "Error in get All Users" });
  }
};
export const getSingleUsers = async (req, res) => {
  try {
    const result = await userModel.findById(req.params.id);
    if (result) {
      res.status(201).send({
        success: true,
        message: `Get ${result.name} Successfully`,
        result,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ error, success: false, message: "Error in get Single Users" });
  }
};
export const searchUsers = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await userModel
      .find({
        $or: [
          { name: { $regex: keyword } },
          { email: { $regex: keyword } },
          { phone: { $regex: keyword } },
          { address: { $regex: keyword } },
        ],
      })
      .sort({ createdAt: -1 });
    if (result) {
      res
        .status(201)
        .send({ success: true, message: "Get users Successfully", result });
    }
  } catch (error) {
    res
      .status(500)
      .send({ error, success: false, message: "Error in Searching Users" });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const role = await userModel.findById(req.params.id);
    if (role?.role === 0) {
      const result = await userModel.findByIdAndDelete(req.params.id);
      if (result) {
        res.status(201).send({
          success: true,
          message: `${result.name} Deleted SuccessFully`,
        });
      }
    } else {
      res.status(200).send({ success: true, message: "Admin Can't Delete" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ error, success: false, message: "Error in deleting Users" });
  }
};
