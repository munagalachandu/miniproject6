const twilio = require("twilio");

function canSendTwilioMessage() {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_WHATSAPP_FROM &&
      process.env.TWILIO_WHATSAPP_TO
  );
}

async function sendWaterTankEmptyAlert() {
  if (!canSendTwilioMessage()) {
    console.log("Twilio credentials missing. Skipping WhatsApp alert.");
    return { skipped: true };
  }

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  return client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: process.env.TWILIO_WHATSAPP_TO,
    body: "🚨 Your water tank is empty. Please refill."
  });
}

module.exports = { sendWaterTankEmptyAlert };
