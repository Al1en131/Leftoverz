import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function Footer() {
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme && storedTheme !== theme) {
      setTheme(storedTheme);
    }
  }, [theme, setTheme]);
  return (
    <footer
      className={`text-white text-center ${
        theme === "dark" ? "bg-[#080B2A]" : "bg-blue-400"
      }`}
    >
      <div className="bg-white/5 p-4">
        <p>&copy; 2025 Leftoverz. All rights reserved.</p>
      </div>
    </footer>
  );
}
