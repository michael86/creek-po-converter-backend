import request from "supertest";
import app from "../src/index";
import { closeDBConnection } from "../src/db/config";
import path from "path";

let server: any;
let authCookie: string;

beforeAll(async () => {
  server = app.listen(0);
  const response = await request(app)
    .post("/user/login")
    .send({ email: "mynewaccount@gmail.com", password: "password123" });

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("status", "success");
  expect(response.headers["set-cookie"]).toBeDefined();

  authCookie = response.headers["set-cookie"][0];
});

describe("PDF API Tests", () => {
  it("Should return 400 for missing purchase_order in /pdf/upload", async () => {
    const filePath = path.join(__dirname, "pdfs", "missing_po.pdf");

    const res = await request(app)
      .post("/pdf/upload")
      .set("Content-Type", "multipart/form-data")
      .attach("file", filePath)
      .set("Cookie", authCookie);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("status", "error");
    expect(res.body).toHaveProperty("message", "Invalid purchase order");
  });
});

afterAll(async () => {
  await closeDBConnection();
  server.close();
});
