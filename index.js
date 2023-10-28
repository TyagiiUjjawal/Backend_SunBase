const express = require("express");
const axios = require("axios");
const { log } = require("console");

const app = express();
const port = 5000; // Set your desired port number

// Use the built-in middleware for parsing JSON in Express 4.16.0 and later
app.use(express.json());

// Allow Cross-Origin Resource Sharing (CORS)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Create a route to proxy the API request
app.post("/proxy-auth", async (req, res) => {
  const { login_id, password } = req.body;
  console.log("====================================");
  console.log(login_id, password);
  console.log("====================================");
  try {
    const response = await axios.post(
      "https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp",
      {
        login_id,
        password,
      }
    );

    // Send the response from the API to the client
    res.json(response.data);
  } catch (error) {
    console.error("Error in proxy-auth:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/delete-customer", async (req, res) => {
  const { uuid, token } = req.body;

  try {
    const response = await axios.post(
      `https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp?cmd=delete&uuid=${uuid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Send the response from the API to the client
    res.json(response.data);
  } catch (error) {
    console.error("Error in proxy-auth:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get-customer", async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Token missing." });
  }

  try {
    const response = await axios.get(
      "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error getting customer:", error);
    return res.status(500).json({ error: "Internal Server Error", error });
  }
});
app.post("/create-customer", async (req, res) => {
  const { token, data } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Token missing." });
  }

  try {
    const response = await axios.post(
      "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=create",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error creating customer:", error);
    return res.status(500).json({ error: "Internal Server Error", error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
