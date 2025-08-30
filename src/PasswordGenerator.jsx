import { useState } from "react";

function generatePassword(length, options) {
  let chars = "";
  if (options.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (options.lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
  if (options.numbers) chars += "0123456789";
  if (options.symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  if (!chars) return ""; // اگر هیچ گزینه‌ای فعال نباشد، پسورد خالی است

  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  });

  const onGenerate = () => {
    const pass = generatePassword(length, options);
    setPassword(pass);
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">تولید رمز عبور دلخواه</h1>

      <label className="block mb-2">طول رمز عبور:</label>
      <input
        type="number"
        min={4}
        max={64}
        value={length}
        onChange={(e) => setLength(Number(e.target.value))}
        className="w-full p-2 mb-4 rounded bg-gray-800 border border-gray-600 text-white"
      />

      <div className="mb-4">
        <label className="inline-flex items-center mr-4">
          <input
            type="checkbox"
            checked={options.uppercase}
            onChange={() =>
              setOptions((opts) => ({ ...opts, uppercase: !opts.uppercase }))
            }
            className="mr-2"
          />
          حروف بزرگ (A-Z)
        </label>
        <label className="inline-flex items-center mr-4">
          <input
            type="checkbox"
            checked={options.lowercase}
            onChange={() =>
              setOptions((opts) => ({ ...opts, lowercase: !opts.lowercase }))
            }
            className="mr-2"
          />
          حروف کوچک (a-z)
        </label>
        <label className="inline-flex items-center mr-4">
          <input
            type="checkbox"
            checked={options.numbers}
            onChange={() =>
              setOptions((opts) => ({ ...opts, numbers: !opts.numbers }))
            }
            className="mr-2"
          />
          اعداد (0-9)
        </label>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={options.symbols}
            onChange={() =>
              setOptions((opts) => ({ ...opts, symbols: !opts.symbols }))
            }
            className="mr-2"
          />
          سمبل‌ها (!@#$...)
        </label>
      </div>

      <button
        onClick={onGenerate}
        className="w-full p-3 bg-pink-700 hover:bg-pink-600 rounded font-bold mb-4 border-none outline-none"
      >
        ساخت رمز تصادفی
      </button>

      <input
        type="text"
        readOnly
        value={password}
        placeholder="رمز تولید شده اینجا نمایش داده می‌شود"
        className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
      />
    </div>
  );
}
