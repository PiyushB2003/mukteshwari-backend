import db from "../db/DbConnect.js";

const GetBranches = async (req, res) => {
    try {
        db.query("SELECT branch_name, branch_city FROM branches", async (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Error fetching values", success: false });
            }
            res.status(200).json({ message: "Branches fetched successfully", success: true, branches: result });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
}

const GetBranchById = async (req, res) => {
    const { branchId } = req.params;
    const query = "SELECT * FROM branches WHERE branch_id = ?";

    try {
        db.query(query, [branchId], async (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Error fetching branch", success: false });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: "Branch not found", success: false });
            }

            res.status(200).json({ message: "Branch fetched successfully", success: true, branch: result });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
}

const GetUserRequestsById = async (req, res) => {
    const { userId } = req.params;


    if (!userId) {
        return res.status(400).json({ message: "User ID is required", success: false });
    }

    const requestsQuery = "SELECT * FROM requests WHERE user_id = ?";
    const userQuery = "SELECT first_name AS firstname, last_name AS lastname, created_at FROM users WHERE user_id = ?";

    try {
        db.query(requestsQuery, [userId], async (err, requestsResult) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Error fetching user requests",
                    success: false
                });
            }

            db.query(userQuery, [userId], async (err, userResult) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Error fetching user details",
                        success: false
                    });
                }

                if (requestsResult.length === 0 && userResult.length === 0) {
                    return res.status(404).json({
                        message: "No requests or user found for this user ID",
                        success: false
                    });
                }

                const userInfo = userResult.length > 0 ? {
                    firstname: userResult[0].firstname,
                    lastname: userResult[0].lastname,
                    user_created_at: userResult[0].created_at
                } : null;

                res.status(200).json({
                    message: "Data fetched successfully",
                    success: true,
                    requests: requestsResult,
                    user: userInfo
                });
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const GetAllUsers = (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error("Error fetching users", err.message);
            return res.status(500).json({ message: 'Server error', success: false });
        }
        res.status(200).json({ message: "Users fetched successsfully", users: results, success: true });
    })
}

const GetUsers = (req, res) => {
    const { branch_id } = req.query;
    console.log("Branch ID ", branch_id);

    if (!branch_id) {
        return res.status(400).json({ message: "Branch ID is required", success: false });
    }

    db.query('SELECT * FROM users WHERE branch_id = ?', [branch_id], (err, results) => {
        if (err) {
            console.error("Error fetching users", err.message);
            return res.status(500).json({ message: 'Server error', success: false });
        }
        res.status(200).json({ message: "Users fetched successsfully", users: results, success: true });
    })
}

const GetUsersByBranchId = (req, res) => {
    const { branch_id } = req.query;

    if (!branch_id) {
        return res.status(400).json({ message: "Branch ID is required", success: false });
    }

    db.query('SELECT * FROM users WHERE branch_id = ?', [branch_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Server error', success: false });
        }
        res.status(200).json({ message: "Users fetched successsfully", users: results, success: true });
    })
}

export const GetUserByUserId = (req, res) => {
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json({ message: "User ID is required", success: false });
    }

    db.query('SELECT * FROM users WHERE user_id = ?', [user_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Server error', success: false });
        }

        res.status(200).json({ message: "Users fetched successsfully", users: results, success: true });
    })
}

const GetEvent = (req, res) => {
    const sql = 'SELECT * FROM events';
    try {
        db.query(sql, (err, results) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send({ message: 'Server error', success: false });
            }
            res.status(200).json({ message: "Events fetched successsfully", events: results, success: true });
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", success: false })
    }
}


// Changed
const GetRequests = (req, res) => {
    const query = `
        SELECT requests.id, requests.user_id, requests.event_id, users.first_name, users.last_name, users.branch_id, events.event_name, requests.status, events.recurrence_day, requests.date
        FROM requests
        JOIN users ON requests.user_id = users.user_id
        JOIN events ON requests.event_id = events.event_id
    `;
    db.query(query, (err, results) => {
        if (err) throw err;
        res.status(200).send(results);
    });
}

// Changed
const GetBranchRequests = (req, res) => {
    const { branch_id } = req.query;

    if (!branch_id) {
        return res.status(400).json({ error: "branch_id is required" });
    }
    const query = `
        SELECT requests.id, requests.user_id, requests.event_id,
        users.first_name, users.last_name, users.phone_number, events.event_name,
        requests.status, requests.date
        FROM requests
        JOIN users ON requests.user_id = users.user_id
        JOIN events ON requests.event_id = events.event_id
        WHERE users.branch_id = ?
    `;
    db.query(query, [branch_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database query failed", success: false });
        }

        res.status(200).json({ requests: results, success: true });
    });
}

// const GetBranchesByCity = async (req, res) => {
//     try {
//         const [rows] = await db.promise().query(`
//             SELECT branch_id, branch_city, branch_name
//             FROM branches
//             ORDER BY branch_city
//         `);
//         res.json(rows);
//     } catch (error) {
//         console.error("Error fetching branches:", error);
//         res.status(500).json({ error: "Internal Server Error", success: false });
//     }
// };


export const GetBranchesByCity = async (req, res) => {
    try {
        const query = `SELECT branch_city, branch_name, branch_id FROM branches ORDER BY branch_city`;

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Database query failed", success: false });
            }
            res.status(200).json({ cities: results, success: true });
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", success: false });
    }
};


export { GetBranches, GetBranchById, GetUsers, GetEvent, GetRequests, GetBranchRequests, GetBranchesByCity, GetAllUsers, GetUserRequestsById, GetUsersByBranchId };