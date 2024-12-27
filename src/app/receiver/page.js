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
  
  const verifyOtp = async () => {
    try {
      const currentTime = Math.floor(Date.now() / (1000 * 60 * 2)); // Time rounded to 2-minute intervals
  
      // Retrieve attempts and last reset time from local storage
      const storedData = JSON.parse(localStorage.getItem("otpAttempts")) || {
        attempts: 0,
        lastResetTime: currentTime,
      };
  
      let { attempts, lastResetTime } = storedData;
  
      // Reset attempts if a new 2-minute interval has started
      if (currentTime !== lastResetTime) {
        attempts = 0;
        lastResetTime = currentTime;
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
        // Reset attempts on successful validation
        attempts = 0;
        lastResetTime = currentTime;
      } else {
        // Increment attempts on failure
        attempts += 1;
        setMessage("Invalid OTP. Please try again.");
      }
  
      // Save updated data back to local storage
      localStorage.setItem(
        "otpAttempts",
        JSON.stringify({ attempts, lastResetTime })
      );
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
