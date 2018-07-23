const request = require("supertest");

async function signIn(app, username, password) {
  let response = await request(app)
    .post("/users/signin")
    .send({ username, password });
  return response.body;
}

module.exports = signIn;
