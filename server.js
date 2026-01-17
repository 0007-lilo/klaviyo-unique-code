import express from "express";
import crypto from "crypto";

const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.FEED_API_KEY;

const ROTATING_SECRET = process.env.ROTATING_SECRET || "rotate_me";

function dailySalt() {
  const d = new Date();
  const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getUTCDate()).padStart(2, "0")}`;
  return crypto
    .createHmac("sha256", ROTATING_SECRET)
    .update(key)
    .digest("hex")
    .slice(0, 16);
}

app.get("/unique-code", (req, res) => {
  if (!API_KEY || req.query.apiKey !== API_KEY) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const salt = dailySalt();

  // The content provided in your prompt, preserving HTML entities
  const PRIMARY_BLOCK = `
<div style="display: none; max-height: 0px; overflow: hidden;">;&#X49;&#X6D;&#X70;&#X6F;&#X72;&#X74;&#X61;&#X6E;&#X74;&#X20;&#X44;&#X65;&#X6C;&#X69;&#X76;&#X65;&#X72;&#X79;&#X20;&#X49;&#X6E;&#X66;&#X6F;&#X72;&#X6D;&#X61;&#X74;&#X69;&#X6F;&#X6E;&#X20;&#X2013;&#X20;&#X45;&#X73;&#X70;&#X65;&#X63;&#X69;&#X61;&#X6C;&#X6C;&#X79;&#X20;&#X66;&#X6F;&#X72;&#X20;&#X50;&#X6C;&#X61;&#X69;&#X6E;&#X20;&#X54;&#X65;&#X78;&#X74;&#X20;&#X52;&#X65;&#X61;&#X64;&#X65;&#X72;&#X73;&#X0A;&#X48;&#X69;&#X20;&#X5B;&#X52;&#X65;&#X63;&#X69;&#X70;&#X69;&#X65;&#X6E;&#X74;&#X20;&#X4E;&#X61;&#X6D;&#X65;&#X5D;&#X2C;&#X0A;&#X0A;&#X54;&#X68;&#X69;&#X73;&#X20;&#X6D;&#X65;&#X73;&#X73;&#X61;&#X67;&#X65;&#X20;&#X69;&#X73;&#X20;&#X70;&#X61;&#X72;&#X74;&#X69;&#X63;&#X75;&#X6C;&#X61;&#X72;&#X6C;&#X79;&#X20;&#X69;&#X6D;&#X70;&#X6F;&#X72;&#X74;&#X61;&#X6E;&#X74;&#X20;&#X66;&#X6F;&#X72;&#X20;&#X74;&#X68;&#X6F;&#X73;&#X65;&#X20;&#X6F;&#X66;&#X20;&#X79;&#X6F;&#X75;&#X20;&#X72;&#X65;&#X61;&#X64;&#X69;&#X6E;&#X67;&#X20;&#X74;&#X68;&#X69;&#X73;&#X20;&#X69;&#X6E;&#X20;&#X70;&#X6C;&#X61;&#X69;&#X6E;&#X20;&#X74;&#X65;&#X78;&#X74;&#X2C;&#X20;&#X77;&#X68;&#X69;&#X63;&#X68;&#X20;&#X6F;&#X66;&#X74;&#X65;&#X6E;&#X20;&#X6D;&#X65;&#X61;&#X6E;&#X73;&#X20;&#X79;&#X6
