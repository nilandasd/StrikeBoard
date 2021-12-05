const request = require("supertest");
const path = require("path");
const { app, getMongoDBInstance, redisClient} = require("../src/app");


require("dotenv").config({ path: path.join(__dirname, '../src/private/.env') });

describe("Test the root path", () => {
    afterAll(async () => {
        const mongoDB = getMongoDBInstance();
        await mongoDB.disconnect();
        redisClient.quit();
    });

    const agent = request.agent(app);

    test("200 for GET root", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
    });

    test("404 for non existing route", async () => {
        const response = await request(app).get("/doesnotexist");
        expect(response.statusCode).toBe(404);
    });

    test("response to login with no credentials", async () => {
        const response = await request(app).post("/auth/login");
        expect(response.statusCode).toBe(400);
    });

    test("response to login with bad credentials", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({username: 'bad', password: 'bad'});
        expect(response.statusCode).toBe(401);
    });

    test("response to private route before login", async () => {
        const response = await request(app).get("/projects/");
        expect(response.statusCode).toBe(401);
    });

    test("login with good credentials", async () => {
        const response = await agent
            .post("/auth/login")
            .send({username: 'blah2', password: '12adsf34'});
        console.log(response.headers);
        expect(response.statusCode).toBe(200);
    });

    test("response to private route after login", async () => {
        const response = await agent.get("/projects/");
        expect(response.statusCode).toBe(200);
    });

    test("response to private route after login", async () => {
        const response = await agent.get("/tasks/");
        expect(response.statusCode).toBe(200);
    });

    test("response to private route after login", async () => {
        const response = await agent.get("/users");
        expect(response.statusCode).toBe(200);
    });

    test("logout while logged in", async () => {
        const response = await agent
            .post("/auth/logout");
        expect(response.statusCode).toBe(200);
    });

    test("logout while loggedout", async () => {
        const response = await request(app)
            .post("/auth/logout")
            .send({ username: 'blah2', password: '12adsf34' });
        expect(response.statusCode).toBe(401);
    });

    test("response to private route after logout", async () => {
        const response = await agent.get("/projects/");
        expect(response.statusCode).toBe(401);
    });

});
