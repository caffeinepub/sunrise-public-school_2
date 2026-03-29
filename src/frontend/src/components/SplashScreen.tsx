import { motion } from "motion/react";
import { getSchoolSettings } from "../pages/Settings";

export default function SplashScreen() {
  const schoolName = getSchoolSettings().name;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background:
          "linear-gradient(135deg, oklch(0.22 0.06 250) 0%, oklch(0.30 0.10 240) 50%, oklch(0.20 0.08 260) 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
      }}
    >
      {/* Animated graduation cap icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "backOut", delay: 0.2 }}
        style={{ marginBottom: "8px" }}
      >
        <svg
          width="90"
          height="90"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Graduation cap — School Management System"
        >
          <title>Graduation cap — School Management System</title>
          {/* Outer glow ring */}
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke="oklch(0.75 0.12 200)"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />
          <circle cx="50" cy="50" r="40" fill="oklch(0.28 0.08 250)" />
          {/* Graduation cap */}
          <polygon
            points="50,26 78,40 50,54 22,40"
            fill="oklch(0.85 0.15 195)"
          />
          <rect
            x="44"
            y="53"
            width="12"
            height="14"
            rx="2"
            fill="oklch(0.75 0.14 195)"
          />
          <ellipse cx="50" cy="67" rx="9" ry="4" fill="oklch(0.85 0.15 195)" />
          {/* Tassel */}
          <line
            x1="78"
            y1="40"
            x2="78"
            y2="57"
            stroke="oklch(0.90 0.18 75)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="78" cy="59" r="3" fill="oklch(0.90 0.18 75)" />
        </svg>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        style={{ textAlign: "center" }}
      >
        <h1
          style={{
            fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
            fontWeight: 800,
            color: "oklch(0.97 0.02 240)",
            letterSpacing: "-0.02em",
            margin: 0,
            lineHeight: 1.1,
            textShadow: "0 2px 20px oklch(0.5 0.15 240 / 0.4)",
          }}
        >
          School Management System
        </h1>
        <p
          style={{
            fontSize: "clamp(0.85rem, 2.5vw, 1.05rem)",
            color: "oklch(0.75 0.08 220)",
            marginTop: "8px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          {schoolName}
        </p>
      </motion.div>

      {/* Loading bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.4 }}
        style={{ width: "min(280px, 70vw)", marginTop: "8px" }}
      >
        <div
          style={{
            height: "4px",
            background: "oklch(0.35 0.08 250)",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.4, delay: 1.0, ease: "easeInOut" }}
            style={{
              height: "100%",
              background:
                "linear-gradient(90deg, oklch(0.70 0.18 200), oklch(0.85 0.15 195))",
              borderRadius: "999px",
              boxShadow: "0 0 12px oklch(0.75 0.20 200 / 0.7)",
            }}
          />
        </div>
        <p
          style={{
            textAlign: "center",
            color: "oklch(0.60 0.06 230)",
            fontSize: "0.75rem",
            marginTop: "10px",
            letterSpacing: "0.05em",
          }}
        >
          Loading...
        </p>
      </motion.div>
    </motion.div>
  );
}
