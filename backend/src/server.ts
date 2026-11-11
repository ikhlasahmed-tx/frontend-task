import "dotenv/config";
import { AppDataSource } from "./config/dataSource"
import { app } from "./app";

const port = Number(process.env.PORT) || 4000;

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing: add it to .env (see .env.example)")
    process.exit(1)
}

try {
    await AppDataSource.initialize()
    console.log("Data Source has been initialized!")

    app.listen(port, () => {
    console.log(`API on http://localhost:${port} · docs at http://localhost:${port}/api-docs`);
    
});
} catch (error) {
    console.error("Error during Data Source initialization", error)
}
