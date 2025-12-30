import express from "express";
import crypto from "crypto";

const app = express();

app.get("/unique-code", (req, res) => {
  const apiKey = req.query.apiKey;

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "unauthorized" });
  }

  res.set("Cache-Control", "no-store");
  res.json({ code: crypto.randomUUID() });
});

const port = process.env.PORT || 3000;
app.listen(port);
