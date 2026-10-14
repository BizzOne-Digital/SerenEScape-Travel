"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { IMAGES } from "@/config/images";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SESSION_KEY = "serenescape-session-loaded";

function subscribeNoop() {
  return () => {};
}

export function PageLoader() {
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const duration = reducedMotion ? 400 : 2200;
    const timer = window.setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setVisible(false);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [visible, reducedMotion]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-luxury-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.2 : 0.8, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden={!visible}
          role="presentation"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-1/4 top-1/4 h-96 w-96 rounded-full bg-rich-berry/30 blur-[100px]" />
            <div className="absolute -right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-burnt-orange/20 blur-[90px]" />
          </div>

          <motion.div
            className="relative flex flex-col items-center gap-6"
            initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reducedMotion ? 0.15 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reducedMotion ? 0 : 0.2, duration: 0.7 }}
            >
              <Image
                src={IMAGES.logo.src}
                alt={IMAGES.logo.alt}
                width={280}
                height={112}
                priority
                className="h-auto w-52 sm:w-64"
              />
            </motion.div>

            <motion.div
              className="h-px w-24 bg-gradient-to-r from-transparent via-muted-gold to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: reducedMotion ? 0 : 0.5, duration: 0.8 }}
            />

            <motion.p
              className="font-sans text-xs uppercase tracking-[0.35em] text-soft-ivory/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reducedMotion ? 0 : 0.7, duration: 0.6 }}
            >
              Belong Everywhere.
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
