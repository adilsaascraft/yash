import axios from "axios";

export async function sendRegisterSMS({
  mobile,
  name,
  regNum,
  qrLink,
}: {
  mobile: string;
  name: string;
  regNum: string;
  qrLink: string;
}) {
  try {
    const message = `Dear ${name}, your registration ID is ${regNum}. Download your QR here: ${qrLink}. Do not share this link. - SaaScraft Studio`;

    const payload = {
      APIKey: process.env.SMS_GATEWAY_API_KEY,
      senderid: process.env.SMS_GATEWAY_SENDER_ID,
      channel: "2",
      DCS: "0",
      flashsms: "0",
      number: mobile,
      text: message,
      route: process.env.SMS_GATEWAY_ROUTE,
      EntityId: process.env.SMS_GATEWAY_ENTITY_ID,
      dlttemplateid: process.env.SMS_GATEWAY_REGISTER_TEMPLATE_ID,
    };

    console.log("📤 SMS PAYLOAD:", payload);

    const response = await axios.post(
      process.env.SMS_GATEWAY_URL!,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ SMS RESPONSE:", response.data);

    return response.data;
  } catch (error: any) {
    console.error(
      "❌ SMS ERROR:",
      error.response?.data || error.message
    );
    throw error;
  }
}