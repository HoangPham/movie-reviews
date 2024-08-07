import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";

import MoviesDAO from "./dao/moviesDAO.js";
import ReviewsDAO from "./dao/reviewsDAO.js";

async function main() {
    dotenv.config();

    const client = new mongodb.MongoClient(process.env.MOVIEREVIEWS_DB_URI);

    const port = process.env.PORT || 3000;

    try {
        // Connect to mongodb cluster
        await client.connect();
        // Inject database connection into MoviesDAO
        await MoviesDAO.injectDB(client);

        await ReviewsDAO.injectDB(client);
        app.listen(port, () => {
            console.log(`Server is running on port: ${port}, at http://localhost:${port}`);
        })
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

main().catch(console.error);