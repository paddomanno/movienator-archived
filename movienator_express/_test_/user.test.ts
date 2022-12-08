import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { TestDatabaseManager } from "./test_utils/TestDatabaseManager";
import User from "../entity/user";
import request from "supertest";
import app from "../app";

beforeAll(async () => {
  await TestDatabaseManager.getInstance().connectTestDatabase();
  await TestDatabaseManager.getInstance().resetTestDatabase();

  await createTestData();

  console.log("Starting User Tests");
});

async function createTestData() {
  let newUser1 = User.create({
    firstName: "Maggus",
    lastName: "Rühl",
    userName: "Roswita",
    password: "pw",
    comment: "Schwer und falsch",
    birthday: new Date("2000-01-16"),
    following: [],
    followers: [],
  });

  let newUser2 = User.create({
    firstName: "Tschai",
    lastName: "Katla",
    userName: "tschai111",
    password: "123",
    comment: "Masse ist Macht",
    birthday: new Date("2003-02-22"),
    following: [],
    followers: [],
  });

  //Tschai is following Maggus
  newUser2.following.push(newUser1);

  await User.save(newUser1);
  await User.save(newUser2);
}

afterAll(async () => {
  await TestDatabaseManager.getInstance().resetTestDatabase();
  console.log("Finishing User Tests");
});

describe("GET Tests", () => {
  it("Get all users from database TEST", async () => {
    const response = await request(app)
      .get("/user/all")
      .send()
      .expect("Content-Type", "application/json; charset=utf-8");
    //console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body.data[1].firstName).toBe("Maggus");
    expect(response.body.data[0].firstName).toBe("Tschai");
  });

  it("Get user with existing Id TEST", async () => {
    const response = await request(app)
      .get("/user/one/id/1")
      .send()
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.statusCode).toBe(200);
    expect(response.body.data.userId).toBe(1);
    expect(response.body.data.firstName).toBe("Maggus");
    expect(response.body.data.lastName).toBe("Rühl");
  });

  it("Get user with NON-existing Id TEST", async () => {
    const response = await request(app)
      .get("/user/one/id/99")
      .send()
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.statusCode).toBe(404);
  });

  it("Get user with existing userName TEST", async () => {
    const response = await request(app)
      .get("/user/one/username/Roswita")
      .send()
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.statusCode).toBe(200);
    expect(response.body.data.userName).toBe("Roswita");
    expect(response.body.data.firstName).toBe("Maggus");
    expect(response.body.data.lastName).toBe("Rühl");
  });

  it("Get user with NON-existing userName TEST", async () => {
    const response = await request(app)
      .get("/user/one/username/maaaan")
      .send()
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.statusCode).toBe(404);
  });

  it("Get all users whose usernames match the search query TEST", async () => {
    const response = await request(app)
      .get("/user/username/ros")
      .send()
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].firstName).toBe("Maggus");
  });

  it("Get all users whose usernames match the UNMATCHABLE search query TEST", async () => {
    const response = await request(app)
      .get("/user/username/Maan")
      .send()
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(0);
  });

  it("Get all users that are following a single user TEST", async () => {
    const response = await request(app)
      .get("/user/followers/1")
      .send()
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].firstName).toBe("Tschai"); //TODO: Here im not sure if the test is fine the way its right now
  });

  it("Get all users that are following a NON-EXISTING user TEST", async () => {
    const response = await request(app)
      .get("/user/followers/99")
      .send()
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.statusCode).toBe(404);
  });

  it("Get all users that a single user is following TEST", async () => {
    const response = await request(app)
      .get("/user/following/2")
      .send()
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].firstName).toBe("Maggus"); //TODO: Here im not sure if the test is fine the way its right now
  });

  it("Get all users that a NON-EXISTING user is following TEST", async () => {
    const response = await request(app)
      .get("/user/following/99")
      .send()
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.statusCode).toBe(404);
  });
});
