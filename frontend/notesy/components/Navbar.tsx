"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const router = useRouter();
  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : "";

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex justify-between items-center backdrop-blur-md bg-white/40 border-b px-6 py-3 shadow-md sticky top-0 z-50"
    >
      {/* Logo */}
      <motion.h1
        whileHover={{ scale: 1.05 }}
        className="font-bold text-xl text-indigo-700 cursor-pointer"
      >
        NOTESY
      </motion.h1>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Role Badge */}
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm shadow"
        >
          {role}
        </motion.span>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={logout}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1 rounded-lg shadow hover:shadow-xl transition"
        >
          Logout
        </motion.button>
      </div>
    </motion.div>
  );
}
