import db from "../db/DbConnect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const checkPhoneNumber = (req, res) => {
    const { phone_number } = req.body;

    if (!phone_number) {
        return res.status(400).json({ message: "Phone number is required", success: false });
    }

    db.query("SELECT * FROM users WHERE phone_number = ?", [phone_number], (err, result) => {
        if (err) {
            console.log("Database error:", err);
            return res.status(500).json({ message: "Database error", success: false });
        }

        if (result.length > 0) {
            return res.status(400).json({ message: "User already exists!", success: false });
        }

        return res.status(200).json({ message: "Phone number is available", success: true });
    });
};

const UserRegister = async (req, res) => {
    const { first_name, last_name, city, phone_number, password, branch_name } = req.body;

    if (!first_name || !last_name || !city || !phone_number || !password || !branch_name) {
        return res.status(400).json({ message: "All fields are required", success: false });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if the phone number already exists
        db.query("SELECT * FROM users WHERE phone_number = ?", [phone_number], (err, userResult) => {
            if (err) {
                console.log("Error checking existing user:", err);
                return res.status(500).json({ message: "Database error", success: false });
            }

            if (userResult.length > 0) {
                return res.status(400).json({ message: "User already exists!", success: false });
            }

            // Get branch ID from branch name
            db.query("SELECT branch_id FROM branches WHERE branch_name = ?", [branch_name], (err, branchResult) => {
                if (err || branchResult.length === 0) {
                    console.log("Error fetching branch ID:", err || "Branch not found");
                    return res.status(400).json({ message: "Invalid branch name", success: false });
                }

                const branch_id = branchResult[0].branch_id;

                // Insert new user
                db.query(
                    "INSERT INTO users (first_name, last_name, city, phone_number, password, branch_name, branch_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    [first_name, last_name, city, phone_number, hashedPassword, branch_name, branch_id],
                    (err, result) => {
                        if (err) {
                            console.log("Error while registering user:", err);
                            return res.status(500).json({ message: "Error while registering you", success: false });
                        }
                        return res.status(200).json({ message: "User Registered Successfully", success: true });
                    }
                );
            });
        });
    } catch (error) {
        console.log("Error of catch", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

export const loginAdmin = (req, res) => {
    const { email, password } = req.body;

    console.log(`🔍 Checking admin login for: ${email}`);

    if (!process.env.SECRET_KEY) {
        console.error("🚨 Error: SECRET_KEY is missing in environment variables!");
        return res.status(500).json({ error: "Internal server error" });
    }

    db.query("SELECT * FROM admin WHERE email = ?", [email], (err, results) => {
        if (err) {
            console.error("🚨 Login Error:", err);
            return res.status(500).json({ error: "Error logging in" });
        }

        if (results.length === 0) {
            console.error("🚨 No admin found with this email!");
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const admin = results[0];

        bcrypt.compare(password, admin.password, (err, isMatch) => {
            if (err) {
                console.error("🚨 Password Comparison Error:", err);
                return res.status(500).json({ error: "Error verifying password" });
            }

            if (!isMatch) {
                console.error("🚨 Incorrect password!");
                return res.status(401).json({ error: "Invalid email or password" });
            }

            console.log("✅ Login successful!");
            const token = jwt.sign({ id: admin.id }, process.env.SECRET_KEY, {
                expiresIn: "24h",
            });

            res.json({ message: "Login successful", token, admin });
        });
    });
};

const UserLogin = async (req, res) => {
    const { phone_number, password } = req.body;
    try {
        db.query("SELECT * FROM users WHERE phone_number = ?", [phone_number], async (err, result) => {
            if (err) {
                console.log("Error got while login ", err)
                return res.status(500).json({ message: "Error fetching values", success: false });
            }
            if (result.length > 0) {
                const isPasswordValid = await bcrypt.compare(password, result[0].password);
                if (isPasswordValid) {
                    console.log("Login Successful")
                    const token = jwt.sign(
                        { id: result[0].user_id, phone_number: result[0].phone_number },
                        process.env.JWT_SECRET,
                        { expiresIn: "2h" }
                    )
                    return res.status(200).json({ message: "User Login Successful", success: true, userToken: token, userId: result[0].user_id });
                } else {
                    return res.status(401).json({ message: "Invalid Credential", success: false });
                }
            }
            else {
                return res.status(401).json({ message: "Invalid Credential", success: false });
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}


export { checkPhoneNumber, UserRegister, UserLogin };