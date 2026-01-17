import express from "express";
import crypto from "crypto";

const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.FEED_API_KEY;

// optional rotation so the block changes over time without you touching templates
const ROTATING_SECRET = process.env.ROTATING_SECRET || "rotate_me";

function dailySalt() {
  const d = new Date();
  const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
    d.getUTCDate()
  ).padStart(2, "0")}`;
  return crypto.createHmac("sha256", ROTATING_SECRET).update(key).digest("hex").slice(0, 16);
}

app.get("/unique-code", (req, res) => {
  if (!API_KEY || req.query.apiKey !== API_KEY) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const salt = dailySalt();

  // PUT YOUR "PRIMARY" CODE INSIDE THIS BLOCK.
  // Replace ONLY the PRIMARY_BLOCK string.
  const PRIMARY_BLOCK = `
<div style="display:none;max-height:0px;overflow:hidden">
  <div id="container">
    <data value="welcome" data-category="@"></data>
    <data value="active" data-status="active">&#8203;</data>

    <!-- v2:${salt}:{{ person.id|default:"x" }}:{{ email|default:"x" }}:{{ campaign.id|default:"x" }}:{{ message|default:"x" }} -->

  </div>
</div>
`.trim();

  res.set("Cache-Control", "no-store, max-age=0");
  res.json([{ code: PRIMARY_BLOCK }]);
});

app.get("/health", (req, res) => res.status(200).send("ok"));

app.listen(PORT, () => console.log("running"));
