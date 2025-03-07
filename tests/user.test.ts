import request from "supertest";
import app from "../src/index";
import { closeDBConnection } from "../src/db/config";

let server: any;

beforeAll(() => {
  server = app.listen(0); // Start the server before running tests
});

describe("User API Tests", () => {
  //uncomment to test register
  //   test("Should return 200 and success message for /register", async () => {
  //     const response = await request(app)
  //       .post("/user/register")
  //       .send({ email: "mynewaccount@gmail.com", password: "password123", name: "my test" });

  //     expect(response.status).toBe(200);
  //     expect(response.body).toHaveProperty("status", "success");
  //   });

  test("Should return 400 for missing fields in /register", async () => {
    const response = await request(app).post("/user/register").send({ email: "" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", "error");
  });

  test("Should return 200 and contain user email and name along with http cookie", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({ email: "mynewaccount@gmail.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toEqual(
      expect.objectContaining({
        email: expect.any(String),
        name: expect.any(String),
      })
    );
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.headers["set-cookie"][0]).toMatch(/^authCookie=.*;/);
  });

  test("Should return 401 with message invalid email or password", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({ email: "mynewaccount@gmail.com", password: "mywrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("status", "error");
    expect(response.body).toHaveProperty("message", "Invalid email or password");
  });
});

afterAll(async () => {
  await closeDBConnection();
  server.close();
});
