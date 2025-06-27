"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const [display, setDisplay] = useState(pathname);

  useEffect(() => {
    setDisplay(pathname);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={display}
        initial={{
          opacity: 0,
          filter: "blur(4px)",
        }}
        animate={{
          opacity: 1,
          filter: "blur(0px)",
        }}
        exit={{
          opacity: 0,
          filter: "blur(2px)",
        }}
        transition={{
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
