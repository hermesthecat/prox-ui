import express from "express";
import { jwtAuth, jwtAuthAdmin } from "../../auth.js";
const router = express.Router();
import user from "../models/user.model.js";
import { getHashedPassword } from "../../utils.js";
import uuid4 from "uuid4";

router.get("/", jwtAuth, async (req, res) => {
  const users = await user.findAll();
  res.render("users", { title: "Users", users });
});

router.post("/create", jwtAuthAdmin, async (req, res) => {
  const { userName, password } = req.body;
  const hashedPassword = getHashedPassword(password);
  const id = uuid4();

  user
    .create({ id, userName, password: hashedPassword })
    .then(() => {
      res.status(201).send("User created");
    })
    .catch((err) => {
      res.status(409).send("User already exists");
    });
});

router.post("/update", async (req, res) => {
  const { id, apiToken, tokenSecret } = req.body;
  await user
    .update({ apiToken, tokenSecret }, { where: { id } })
    .then(() => {
      res.status(204).send("User updated");
      res.redirect("/users");
    })
    .catch((err) => {
      res.status(409).send("User may exists");
    });
});

export default router;