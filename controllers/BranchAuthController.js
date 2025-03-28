import db from "../db/DbConnect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const BranchRegister = async (req, res) => {
    const { branch_username, branch_password, branch_name, branch_state, branch_city, branch_manager_name, contact_number, branch_address } = req.body;

    if (!branch_username || !branch_password || !branch_name || !branch_state || !branch_city || !branch_manager_name || !contact_number || !branch_address) {
        return res.status(400).json({ message: "All fields are required", success: false });
    }

    try {
        const hashedPassword = await bcrypt.hash(branch_password, 10);
        db.query(
            "INSERT INTO branches (branch_username, branch_password, branch_name, branch_city, branch_state, branch_manager_name, contact_number, branch_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [branch_username, hashedPassword, branch_name, branch_city, branch_state, branch_manager_name, contact_number, branch_address],
            async (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: "Error inserting values", success: false });
                }
                res.status(200).json({ message: "Branch Created Successfully", success: true });
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
}

const BranchLogin = async (req, res) => {
    const { branch_username, branch_password } = req.body;
    if (!branch_username || !branch_password) {
        return res.status(400).json({ message: "All fields are required", success: false });
    }
    try {
        db.query(
            "SELECT * FROM branches WHERE branch_username = ?",
            [branch_username],
            async (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: "Error fetching values", success: false });
                }
                if (result.length > 0) {
                    const isPasswordValid = await bcrypt.compare(branch_password, result[0].branch_password);
                    if (isPasswordValid) {
                        const token = jwt.sign(
                            { id: result[0].branch_id, branch_username: result[0].branch_username },
                            process.env.JWT_SECRET,
                            { expiresIn: "2h" }
                        );
                        res.status(200).json({ message: "Branch Login successful", success: true, branchToken: token, branchName: result[0].branch_name, branchId: result[0].branch_id, branchCity: result[0].branch_city });
                    } else {
                        res.status(401).json({ message: "Invalid credentials", success: false });
                    }
                } else {
                    res.status(401).json({ message: "Invalid credentials", success: false });
                }
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
}

const BranchUpdate = async (req, res) => {
    const branchId = req.params.id;
    const updatedValues = req.body;

    console.log("Branch ID: ", branchId);
    console.log("Updated Values: ", updatedValues);
    

    if(!branchId) {
        return res.status(400).json({ message: "Branch ID is required.", success: false });
    }

    if (Object.keys(updatedValues).length === 0) {
        return res.status(400).json({ message: "Invalid request. No changes provided.", success: false });
    }

    // Generate SQL query dynamically
    const fields = Object.keys(updatedValues).map(key => `${key} = ?`).join(", ");
    const values = Object.values(updatedValues);

    const query = `UPDATE branches SET ${fields} WHERE branch_id = ?`;
    
    db.query(query, [...values, branchId], (err, result) => {
        if (err) {
            console.error("Update Error:", err);
            return res.status(500).json({ message: "Failed to update branch details", success: false });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Branch not found", success: false });
        }

        res.status(200).json({ message: "Branch details updated successfully!", success: true });
    });
}

const BranchPasswordUpdate = async (req, res) => {
    const { branch_id } = req.params;
    const { newPassword } = req.body;

    if (!branch_id) {
        return res.status(400).json({ message: "Branch id is required!", success: false });
    }

    if (!newPassword) {
        return res.status(400).json({ message: "Password is required!", success: false });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long', success: false });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const sql = 'UPDATE branches SET branch_password = ? WHERE branch_id = ?';

        db.query(sql, [hashedPassword, branch_id], (err, result) => {
            if (err) {
                console.error('Update Password Error:', err);
                return res.status(500).json({ message: 'Something went wrong. Please try again.', success: true });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Branch not found', success: false });
            }
            res.status(200).json({ message: 'Password updated successfully!', success: true });
        });
    } catch (error) {
        console.error('Hashing Error:', error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};


export { BranchRegister, BranchLogin, BranchUpdate, BranchPasswordUpdate };