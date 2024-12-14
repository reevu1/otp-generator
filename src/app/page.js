import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>OTP System</h1>
      <nav>
        <ul>
          <li>
            <Link href="/generator">Go to OTP Generator</Link>
          </li>
          <li>
            <Link href="/receiver">Go to OTP Receiver</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
