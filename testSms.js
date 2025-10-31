import axios from "axios";

const sendOtp = async () => {
  const authKey = "3237656e63656738303394";
  const mobile = "917477246477";
  const sender = "329891"; // 🔹 Approved DLT Header
  const route = "0"; // transactional route
  const DLT_TE_ID = "1702157434240941334"; // 🔹 Your approved OTP template ID
  const otp = Math.floor(100000 + Math.random() * 900000);
  const message = `Your OTP for verification is ${otp}. Please do not share it with anyone.`; // exact DLT message

  const url = `http://control.yourbulksms.com/api/sendhttp.php?authkey=${authKey}&mobiles=${mobile}&sender=${sender}&route=${route}&country=0&DLT_TE_ID=${DLT_TE_ID}&message=${encodeURIComponent(message)}`;

  try {
    const { data } = await axios.get(url);
    console.log("✅ API Response:", data);
    console.log("📲 OTP:", otp);
  } catch (err) {
    console.error("❌ Error sending OTP:", err.message);
  }
};

sendOtp();
