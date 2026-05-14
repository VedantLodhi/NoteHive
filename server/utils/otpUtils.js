const transporter = require("../config/email");
const { getDB } = require("../config/db");

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP in database with expiration
const storeOTP = async (email, otp, purpose) => {
  try {
    const db = getDB();

    if (!db) {
      throw new Error("Database connection error");
    }

    const otpCollection = db.collection("otps");

    // Remove old OTP
    await otpCollection.deleteMany({
      email,
      purpose,
    });

    // Expires in 10 min
    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await otpCollection.insertOne({
      email,
      otp,
      purpose,
      createdAt: new Date(),
      expiresAt,
    });

    console.log(
      `OTP stored for ${email}: ${otp} (${purpose})`
    );

    return true;
  } catch (error) {
    console.error(
      "Error storing OTP:",
      error
    );
    throw error;
  }
};

// Verify OTP
const verifyOTP = async (
  email,
  otp,
  purpose
) => {
  try {
    const db = getDB();

    if (!db) {
      throw new Error(
        "Database connection error"
      );
    }

    const otpCollection =
      db.collection("otps");

    const otpRecord =
      await otpCollection.findOne({
        email,
        otp,
        purpose,
        expiresAt: {
          $gt: new Date(),
        },
      });

    if (otpRecord) {
      await otpCollection.deleteOne({
        _id: otpRecord._id,
      });

      console.log(
        `OTP verified for ${email}`
      );

      return true;
    }

    console.log(
      `OTP verification failed for ${email}`
    );

    return false;
  } catch (error) {
    console.error(
      "OTP verify error:",
      error
    );

    throw error;
  }
};

// Send OTP Email
const sendOTPEmail = async (
  email,
  otp,
  purpose
) => {
  try {
    if (
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASSWORD
    ) {
      console.log(
        `🔥 OTP FOR ${email}: ${otp}`
      );

      return true;
    }

    let subject;

    if (
      purpose === "registration"
    ) {
      subject =
        "Complete Your Registration";
    } else if (
      purpose === "login"
    ) {
      subject =
        "Login Verification OTP";
    } else {
      subject =
        "Verification OTP";
    }

    const html = `
    <div style="
      font-family:Arial;
      max-width:600px;
      margin:auto;
      padding:20px;
    ">
      <h2>${subject}</h2>

      <div style="
      padding:20px;
      background:#f5f5f5;
      border-radius:10px;
      ">

      <p>Your OTP:</p>

      <div style="
      font-size:32px;
      font-weight:bold;
      text-align:center;
      letter-spacing:6px;
      background:white;
      padding:15px;
      border-radius:8px;
      ">
        ${otp}
      </div>

      </div>

      <p>
      OTP expires in 10 minutes
      </p>

    </div>
    `;

    await transporter.sendMail({
      from: `"NoteHive" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
    });

    console.log(
      `📧 OTP sent to ${email}`
    );

    return true;
  } catch (error) {
    console.error(
      "OTP Email Error:",
      error
    );

    throw error;
  }
};

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  sendOTPEmail,
};