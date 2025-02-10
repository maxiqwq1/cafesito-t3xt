const request = require("supertest");
const server = require("../index");
const listaCafes = require("../cafes.json");

describe("operaciones del inventario de cafés", () => {

    it("Devuelve un estado 200 y una lista con al menos un café", async () => {
        const response = await request(server).get("/cafe").send();
        const { body, statusCode } = response;
        expect(statusCode).toBe(200);
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
        expect(typeof body[0]).toBe("object");
    });

    it("Devuelve un 404 al intentar eliminar un café con un ID inexistente", async () => {
        const jwt = "mi-token-seguro";
        const idNoExistente = listaCafes.length + 99;
        const { statusCode } = await request(server)
            .delete(`/cafes/${idNoExistente}`)
            .set("Authorization", jwt)
            .send();
        expect(statusCode).toBe(404);
    });

    it("Agrega un nuevo café y devuelve un código 201", async () => {
        const nuevoCafe = {
            id: 25,
            nombre: "Affogato",
        };

        const response = await request(server).post("/cafes").send(nuevoCafe);
        const { body, statusCode } = response;
        const cafeAgregado = body.find((cafe) => cafe.id === nuevoCafe.id);

        expect(statusCode).toBe(201);
        expect(cafeAgregado).toBeDefined();
        expect(cafeAgregado).toMatchObject(nuevoCafe);
    });

    it("Devuelve un estado 400 si se intenta actualizar un café con un ID diferente al del payload", async () => {
        const jwt = "token";
        const idIncorrecto = 10;
        const cafePayload = {
            id: 3,
            nombre: "Café de especialidad de ka casa ",
        };

        const { statusCode } = await request(server)
            .put(`/cafes/${idIncorrecto}`)
            .set("Authorization", jwt)
            .send(cafePayload);
        expect(statusCode).toBe(400);
    });
});
