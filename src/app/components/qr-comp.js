'use client'
import { useQRCode } from "next-qrcode";
import React from 'react';

export default function QRcomp({otp})
{
    const {Canvas} = useQRCode();
    return (
        <Canvas
          text={otp}
          options={{
            errorCorrectionLevel: 'M',
            margin: 3,
            scale: 4,
            width: 200,
            color: {
              dark: '#000000',
              light: '#FFFFFF',
            },
          }}
        />
      );

}