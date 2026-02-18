import "dotenv/config";


import app from "./app.js";
import databaseConnection from "./config/databaseConnection.config.js";

const PORT = process.env.PORT || 3000;
databaseConnection();
app.listen(PORT, () => {
    
    console.log(`Server is running at http://localhost:${PORT}`);
});