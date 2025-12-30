import express from "express";
import crypto from "crypto";

const app = express();

app.get("/unique-code", (req, res) => {
  const apiKey = req.query.apiKey;

  if (!process.env.API_KEY) {
    return res.status(500).json({ error: "API_KEY not set" });
  }

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "unauthorized" });
  }

  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");

  res.json({ code: crypto.randomUUID() });
});

const port = process.env.PORT || 10000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on ${port}`);
});
