import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

// Middleware de autenticación
app.use((req, res, next) => {
    const key = req.headers["x-api-key"];
    if (key !== API_KEY) {
        return res.status(401).json({ errors: [{ title: "Unauthorized" }] });
    }
    next();
});

// Swagger docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup({
    openapi: "3.0.0",
    info: { title: "Products API", version: "1.0.0" }
}));

// Crear producto
app.post("/products", async (req, res) => {
    const { name, description, price } = req.body;
    const product = await prisma.product.create({ data: { name, description, price } });
    res.json({ data: { type: "product", id: product.id, attributes: product } });
});

// Obtener producto por ID
app.get("/products/:id", async (req, res) => {
    const product = await prisma.product.findUnique({ where: { id: Number(req.params.id) } });
    if (!product) return res.status(404).json({ errors: [{ title: "Not Found" }] });
    res.json({ data: { type: "product", id: product.id, attributes: product } });
});

// Actualizar producto
app.patch("/products/:id", async (req, res) => {
    const { name, description, price } = req.body;
    const product = await prisma.product.update({
        where: { id: Number(req.params.id) },
        data: { name, description, price }
    });
    res.json({ data: { type: "product", id: product.id, attributes: product } });
});

// Eliminar producto
app.delete("/products/:id", async (req, res) => {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
});

// Listar productos
app.get("/products", async (req, res) => {
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 10;
    const products = await prisma.product.findMany({ skip: (page - 1) * size, take: size });
    res.json({
        data: products.map((p: any) => ({
            type: "product",
            id: p.id,
            attributes: p
        }))
    });
});

app.listen(3000, () => console.log("Products service on 3000"));
