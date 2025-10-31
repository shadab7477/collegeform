import axios from "axios";

const BULKSMS_API = "http://control.yourbulksms.com/api/sendhttp.php";

export const sendOtpSms = async (mobile, otp) => {
  try {
    const message = `Your OTP is ${otp}. It is valid for 10 minutes.`;

    const params = {
      authkey: process.env.BULKSMS_AUTH_KEY,
      mobiles: mobile,
      sender: process.env.BULKSMS_SENDER,
      route: process.env.BULKSMS_ROUTE,
      country: process.env.BULKSMS_COUNTRY,
      DLT_TE_ID: process.env.BULKSMS_DLT_ID,
      message: message,
    };

    const response = await axios.get(BULKSMS_API, { params });
    console.log("SMS API Response:", response.data);

    return true;
  } catch (error) {
    console.error("Error sending OTP SMS:", error.message);
    return false;
  }
};
