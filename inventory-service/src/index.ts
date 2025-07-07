import express from "express";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import axios from "axios";
import axiosRetry from "axios-retry";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;
const PRODUCTS_URL = process.env.PRODUCTS_URL;

const client = axios.create({ timeout: 5000 });
axiosRetry(client, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

// Middleware API Key
app.use((req, res, next) => {
    const key = req.headers["x-api-key"];
    if (key !== API_KEY) {
        return res.status(401).json({ errors: [{ title: "Unauthorized" }] });
    }
    next();
});

// Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup({
    openapi: "3.0.0",
    info: { title: "Inventory API", version: "1.0.0" }
}));

// Consultar cantidad de un producto
app.get("/inventory/:productId", async (req, res) => {
    const productId = Number(req.params.productId);

    try {
        await client.get(`${PRODUCTS_URL}/products/${productId}`, {
            headers: { "x-api-key": API_KEY }
        });

        const inventory = await prisma.inventory.findUnique({ where: { productId } });
        res.json({
            data: {
                type: "inventory",
                id: inventory?.id,
                attributes: { quantity: inventory?.quantity ?? 0 }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(404).json({ errors: [{ title: "Product Not Found" }] });
    }
});

// Actualizar cantidad tras compra
app.patch("/inventory/:productId", async (req, res) => {
    const productId = Number(req.params.productId);
    const { quantity } = req.body;

    try {
        await client.get(`${PRODUCTS_URL}/products/${productId}`, {
            headers: { "x-api-key": API_KEY }
        });

        const updated = await prisma.inventory.upsert({
            where: { productId },
            update: { quantity },
            create: { productId, quantity }
        });

        console.log(`📦 Inventario actualizado: Product ${productId}, Quantity: ${quantity}`);
        res.json({
            data: {
                type: "inventory",
                id: updated.id,
                attributes: updated
            }
        });
    } catch (error) {
        console.error(error);
        res.status(404).json({ errors: [{ title: "Product Not Found or Update Failed" }] });
    }
});

app.listen(3000, () => console.log("Inventory service on 3000"));
