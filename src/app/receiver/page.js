"use client";
import { useState } from "react";
import crypto from "crypto";

export default function Receiver() {
  const [inputOtp, setInputOtp] = useState("");
  const [message, setMessage] = useState("");
  const [userIp, setUserIp] = useState("");
  // Helper function to hash input and truncate to 8 digits
  const generate8DigitOtp = (input) => {
    const hash = crypto.createHash("sha256").update(input).digest("hex");
    return parseInt(hash.slice(0, 8), 16) % 100000000; // Ensure it is 8 digits
  };
  // Fetch the user's IP address
  const fetchUserIp = async () => {
    try {
      const response = await fetch("https://api64.ipify.org?format=json"); // Get user's public IP
      const data = await response.json();
      setUserIp(data.ip);
      return data.ip;
    } catch (error) {
      console.error("Error fetching IP:", error);
      throw new Error("Failed to fetch IP address");
    }
  };
  
  const [attempts, setAttempts] = useState(0);
  const [lastResetTime, setLastResetTime] = useState(Math.floor(Date.now() / (1000 * 60 * 2))); // Initialize to the current 2-minute interval

  const verifyOtp = async () => {
    try {
      const currentTime = Math.floor(Date.now() / (1000 * 60 * 2)); // Time rounded to 2-minute intervals

      // Reset attempts if a new 2-minute interval has started
      if (currentTime !== lastResetTime) {
        setAttempts(0);
        setLastResetTime(currentTime);
      }

      // Check if the user has exceeded the maximum attempts
      if (attempts >= 3) {
        setMessage("Too many attempts. Please wait for 2 minutes and try again.");
        return;
      }

      if (inputOtp.length !== 8) {
        setMessage("Invalid input. OTP must be 8 digits long.");
        return;
      }

      const ipAddress = await fetchUserIp(); // Get IP address

      // Validate OTP for both the current and previous time windows
      const validIntervals = [currentTime, currentTime - 1]; // Account for clock drift
      const isValid = validIntervals.some((time) => {
        const recomputedOtp = generate8DigitOtp(`${time}-${ipAddress}`).toString().padStart(8, "0");
        return recomputedOtp === inputOtp;
      });

      if (isValid) {
        setMessage("OTP is valid!");
        setAttempts(0); // Reset attempts on successful validation
      } else {
        setAttempts((prevAttempts) => prevAttempts + 1); // Increment attempts on failure
        setMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error validating OTP:", error);
      setMessage("Error validating OTP. Please check your input.");
    }
  };


  return (
    <div className="block">
      <h1 className="otp fade-in">Secure OTP Receiver</h1>
      <div className="input-box fade-in">
        <label>
          
          <input
            placeholder="Enter OTP"
            className="field"
            type="text"
            value={inputOtp}
            onChange={(e) => setInputOtp(e.target.value)}
          />
        </label>
      </div>
      <button className="links fade-in" onClick={verifyOtp}><span className="front">Verify OTP</span></button>
      {message && <p className="valid">{message}</p>}
    </div>
  );
}
