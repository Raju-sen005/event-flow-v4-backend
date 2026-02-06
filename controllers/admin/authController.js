import Admin from "../../models/admin.model.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash("admin@123", 10);
    await Admin.create({
      username: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
    });
    res.json({ message: "Admin registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    res.json({ message: "Login successful" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
};

export { register, login };
