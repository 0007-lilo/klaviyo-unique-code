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

  const PRIMARY_BLOCK = `
<div style='display:none;'>Hi there, This message contains important privacy information — particularly relevant if you're viewing it in plain text, which may mean you're using an older device or email client. We understand that readers like you tend to care deeply about privacy and how companies handle personal data.Your Account Is Secure. At this time, your account remains completely secure, and there have been no detected breaches or unusual activity. We take a proactive approach to privacy, using advanced safeguards and preventative measures to help protect your information at every step.Why You're Receiving This Message. We believe in transparency and want to make sure you have the information you need to stay protected online. While we continuously update our systems with the latest security measures, it's equally important for you to stay alert — especially if you're accessing your account from an older device or email client.If You Ever Notice Something Unusual. Although rare, security issues can occur. If we ever detect suspicious activity on your account, we'll contact you right away with instructions on how to reset your password or take other steps to secure your data. Likewise, if you ever notice anything unexpected, we encourage you to reach out immediately so we can help ensure your account remains safe. Examples of Security Alerts While security issues are rare, we continuously monitor for anything unusual. Common examples of events that may trigger a security alert include:Sign-in attempts from an unrecognized device or location. Unauthorized changes to your account settings. Any potential attempt to access personal information without permission. Our Proactive Security Measure We take a proactive approach to protecting your data — not just reacting when issues arise. Our systems are constantly monitored and updated with the latest security protocols, including: Strong encryption to protect personal and payment details. Strict access controls to limit who can view sensitive data. Routine security audits to identify and resolve vulnerabilities quickly. A well-defined incident response process to ensure swift, effective action if needed.Your Orders Remain Secure You can shop with full confidence knowing your orders with High Performance are completely safe. Every transaction is encrypted and handled through secure channels to protect your personal and payment information from start to finish. Order Verification and Updates In rare cases, we may need to reach out if there's a delay or issue processing your order. When this happens, our message may ask you to: - Confirm your shipping address. - Clarify certain order details. - Review or acknowledge updated delivery estimates. Important Security Reminder For your safety, please note that we will never ask for sensitive payment information — such as your credit card number, expiration date, or CVV — through email or text. Any request for that kind of data should be treated as suspicious. Your Privacy Is Our Priority At High Performance, protecting your personal and financial information is one of our highest priorities. We continually invest in secure systems and best practices to ensure every order, communication, and transaction remains fully protected. Security Measures We've Implemented We've taken extensive steps to ensure your information remains fully protected, including: - Multi-Factor Authentication: Add an extra layer of security by enabling multi-factor authentication on your account. - Strong Password Policies: Use a strong, unique password and update it regularly. - Regular Security Audits: We continuously review our systems to detect and fix potential vulnerabilities. - Incident Response Plans: We maintain clear, tested procedures to handle any data breach or security incident swiftly and effectively. Even though your account is currently 100% safe, we encourage you to stay proactive. In certain cases, we may ask you to take additional action. Take Action Now: Click the link below to verify your account and follow the on-screen steps to complete the process: [Insert Link Here] We'll also notify you if we ever detect unusual activity on your account. Here's an example of what that alert may look like: Recent Activity Summary: Date: [Date of suspicious activity] Time: [Time of suspicious activity] Location: [Location of suspicious activity] Device: [Device used for suspicious activity] Action: [Description of suspicious activity, e.g., login attempt, password reset request, etc.] If you do not recognize this activity, please reply to this email with the subject line "Unauthorized Access" and we will take immediate steps to secure your account. We may also ask you to take the following additional security measures: - Change your password: Create a strong, unique password that's at least 12 characters long and includes a mix of uppercase and lowercase letters, numbers, and symbols. - Enable two-factor authentication: Add an extra layer of protection by requiring a second verification step, such as a code sent to your phone, along with your password. Thank you for taking the time to review this important information. We're fully committed to protecting your privacy and ensuring a safe, secure online experience every time you interact with us. Sincerely, The High Performance Team. Review Your Account Activity Regularly: We recommend monitoring your account for any unusual transactions or login attempts. Your Security Is Our Priority: At High Performance, we take the protection of your information extremely seriously. Our team is committed to using the latest security technologies and best practices to keep your data safe. If you have any questions or concerns about your account's security, please reach out to us anytime. Thank you for your prompt attention to this matter. Important Reminder: If we ever contact you regarding unusual activity, please do not share sensitive payment information such as your full 16-digit credit card number. We will never ask for this information via email. Sincerely, The High Performance Security Team. Subject: Important Account Security Notice — Hi [Recipient Name], We recently detected unusual activity on your High Performance account. To keep your information safe, we recommend reviewing your account details to confirm that everything looks correct. Here's what may have triggered this alert: sign-in attempts from an unrecognized device or location; unauthorized changes to account settings; potential attempts to access your personal information. What you can do: for your security, please visit our official website directly (not through any links in this email) and log into your account. From there you can review your recent activity, update your password if necessary, and enable two-factor authentication for additional protection. Our commitment to your security: at High Performance, protecting your data is our top priority. We use advanced encryption, regular security audits, and strict access controls to help ensure your personal information remains safe. If you ever receive an email that seems suspicious or asks for sensitive information, please forward it to security@[BRANDNAME[.COM

 so our team can investigate. Sincerely, The High Performance Security Team. We have well-defined incident response plans to handle any data breach or security incident. Your Cooperation is Crucial We understand that this request may seem inconvenient, but your security is our utmost concern. By verifying your account, you are helping us protect your personal information and maintain a secure environment for all our users. If you have any questions or concerns, please contact our support team immediately. Thank you for your prompt attention to this matter. Sincerely, The High Performance Account Security Team

</div>
`.trim();

  res.set("Cache-Control", "no-store, max-age=0");
  res.json([{ code: PRIMARY_BLOCK }]);
});

app.get("/health", (req, res) => res.status(200).send("ok"));

app.listen(PORT, () => console.log("running"));
