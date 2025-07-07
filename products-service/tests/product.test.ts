// tests/product.test.ts
import request from "supertest";
import app from "../src/index";

describe("Products API", () => {
    it("should create a product", async () => {
        const res = await request(app)
            .post("/products")
            .set("x-api-key", process.env.API_KEY)
            .send({ name: "Test", description: "Test Desc", price: 10.5 });
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.attributes.name).toEqual("Test");
    });
});
