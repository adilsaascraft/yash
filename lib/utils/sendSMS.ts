import axios from "axios";

export async function sendRegisterSMS({
 mobile,
 name,
 regNum,
 safeQrLink,
}: {
 mobile: string;
 name: string;
 regNum: string;
 safeQrLink: string;
}) {
 try {
  const cleanName = name.replace(/^(Mr|Mrs|Ms|Dr|Er)\.\s*/i, "").trim();
  const eventName = "6th Edition of Times Property Expo";
  const message = `Dear ${cleanName}, registration id for ${eventName} is ${regNum} and QR Links is ${safeQrLink} Do not share this info to anyone for security reasons. - SaaScraft Studio`;
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

  const response = await axios.get(process.env.SMS_GATEWAY_URL!, {
   params: {
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
   },
  });

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