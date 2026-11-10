import "dotenv/config";
import { AppDataSource } from "./config/dataSource"
import { app } from "./app";

const port = Number(process.env.PORT) || 4000;

try {
    await AppDataSource.initialize()
    console.log("Data Source has been initialized!")

    app.listen(port, () => {
    console.log(`API on http://localhost:${port} · docs at http://localhost:${port}/api-docs`);
    
});
} catch (error) {
    console.error("Error during Data Source initialization", error)
}
