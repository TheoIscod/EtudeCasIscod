const request = require("supertest")
const { app } = require("../server")
const jwt = require("jsonwebtoken")
const config = require("../config")
const mockingoose = require("mockingoose")
const Article = require("../api/articles/articles.schema")
const mongoose = require("mongoose")

describe("tester API articles", () => {
  let token;
  const USER_ID = new mongoose.Types.ObjectId()
  const ARTICLES_ID = new mongoose.Types.ObjectId();

  const MOCK_DATA_CREATED = {
    _id: ARTICLES_ID, 
    content: "Super Article",
    user: USER_ID,
    title: "Super Titre",
    statut: "draft",
  }

  const MOCK_DATA_UPDATED = {
    _id: MOCK_DATA_CREATED._id, 
    title: "Mise à jour du super titre",
    content: "Mise à jour du super article",
    user: MOCK_DATA_CREATED.user,
    statut: "published",
  }

  beforeEach(() => {
    token = jwt.sign(
      {
        id: USER_ID,
        name: "Bernard",
        email: "bernard@gmail.com",
        role: "admin",
      },
      config.secretJwtToken
    );

    mockingoose(Article).toReturn(MOCK_DATA_CREATED, "save")
    mockingoose(Article).toReturn(MOCK_DATA_UPDATED, "findOneAndUpdate")
    mockingoose(Article).toReturn({ acknowledged: true, deletedCount: 1 }, "deleteOne")
  })

  test("Création Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token)

    expect(res.status).toBe(201)
    expect(res.body.title).toBe(MOCK_DATA_CREATED.title)
    expect(res.body.user.toString()).toBe(MOCK_DATA_CREATED.user.toString())
  })

  test("Modification Article", async () => {
    const res = await request(app)
      .put(`/api/articles/${MOCK_DATA_UPDATED._id}`)
      .send(MOCK_DATA_UPDATED)
      .set("x-access-token", token)

    expect(res.status).toBe(200)
    expect(res.body.title).toBe(MOCK_DATA_UPDATED.title)
  })

  test("Suppression Article", async () => {
    const res = await request(app)
      .delete(`/api/articles/${MOCK_DATA_CREATED._id}`)
      .set("x-access-token", token)

    expect(res.status).toBe(204)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })
})
