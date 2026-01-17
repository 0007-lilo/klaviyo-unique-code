import express from "express";
import crypto from "crypto";

const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.FEED_API_KEY;

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

  const PRIMARY_BLOCK = `
<div style='display:none;'>
Hi there, This message contains important privacy information — particularly relevant if you're viewing it in plain text, which may mean you're using an older device or email client. We understand that readers like you tend to care deeply about privacy and how companies handle personal data.

Your Account Is Secure. At this time, your account remains completely secure, and there have been no detected breaches or unusual activity. We take a proactive approach to privacy, using advanced safeguards and preventative measures to help protect your information at every step.

Why You're Receiving This Message. We believe in transparency and want to make sure you have the information you need to stay protected online. While we continuously update our systems with the latest security measures, it's equally important for you to stay alert — especially if you're accessing your account from an older device or email client.

If You Ever Notice Something Unusual. Although rare, security issues can occur. If we ever detect suspicious activity on your account, we'll contact you right away with instructions on how to reset your password or take other steps to secure your data. Likewise, if you ever notice anything unexpected, we encourage you to reach out immediately so we can help ensure your account remains safe.

Examples of Security Alerts include sign-in attempts from unrecognized devices, unauthorized changes to account settings, or attempts to access personal information.

Our systems use strong encryption, strict access controls, routine security audits, and incident response procedures to protect your information.

Important Reminder: We will never ask for sensitive payment information via email.

<!-- v2:${salt}:{{ person.id|default:"x" }}:{{ email|default:"x" }}:{{ campaign.id|default:"x" }}:{{ message|default:"x" }} -->
</div>
`.trim();

  res.set("Cache-Control", "no-store, max-age=0");
  res.json([{ code: PRIMARY_BLOCK }]);
});

app.get("/health", (req, res) => res.status(200).send("ok"));

app.listen(PORT, () => console.log("running"));
