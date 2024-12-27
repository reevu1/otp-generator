"use client";
import { useState } from "react";
import crypto from "crypto";
import QRcomp from "../components/qr-comp";

export default function Generator() {
  const [finalOtp, setFinalOtp] = useState("");
  const [userIp, setUserIp] = useState("");
  const [qrGen,setQrGen] = useState(false);
  // Helper function to hash input and truncate to 8 digits
  const generate8DigitOtp = (input) => {
    const hash = crypto.createHash("sha256").update(input).digest("hex");
    return parseInt(hash.slice(0, 8), 16) % 100000000; // Ensure it is 8 digits
  };
  // Generate OTP
  const generateOtp = async () => {
    try {
      // Fetch the user's IP address
      const response = await fetch("https://api64.ipify.org?format=json"); // Get user's public IP
      const data = await response.json();
      const ipAddress = data.ip; // Extract the IP address
      setUserIp(ipAddress);
      // Generate OTP based on time and IP
      const currentTime = Math.floor(Date.now() / (1000 * 60 * 2)); // Time rounded to 2-minute intervals
      const otp = generate8DigitOtp(`${currentTime}-${ipAddress}`).toString().padStart(8, "0");
      setQrGen(false);
      setFinalOtp(otp);
      
      console.log(`User IP: ${ipAddress}`);
      console.log(`Generated OTP: ${otp}`);
    } catch (error) {
      console.error("Error fetching IP or generating OTP:", error);
    }
  };
  const generateQR = () =>
    {
      setQrGen(true);
    }
  return (
    <div className="block">
      <h1 className="otp fade-in">Secure OTP Generator</h1>
      <button className="links fade-in" onClick={generateOtp}><span className="front">Generate OTP</span></button>
      {finalOtp && (<>
        <p className="valid">
          Your OTP: <strong>{finalOtp}</strong> <br />
          Note: Valid for 2 minutes.
        </p>
        <button className="links fade-in" onClick={generateQR}>
        <span className="front">
        GENERATE QR-CODE
        </span>
        </button></>
      )}
      <div>
        {qrGen && (<QRcomp otp={finalOtp}/>)}
      </div>
    </div>
  );
}
