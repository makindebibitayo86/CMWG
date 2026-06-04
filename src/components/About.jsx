import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const PILLARS = [
  {
    icon: "✦",
    title: "Curated Experiences",
    body: "Every trip is hand-picked — not tour-operator packages, but real adventures built around how we actually travel. Hidden coastlines, local tables, late nights worth remembering.",
  },
  {
    icon: "◈",
    title: "Community First",
    body: "CMWG is a crew, not a company. You travel with people who feel like old friends by the second day. The connections you make outlast the trip.",
  },
  {
    icon: "◎",
    title: "Culture Over Comfort",
    body: "We move with intention. Immersive, off-the-beaten-path, fully present. Not a resort holiday — a life moment.",
  },
];

// Two video sources — swap in your second clip URL below
const VIDEO_SRCS = [
  "https://res.cloudinary.com/dgjcl0te0/video/upload/q_auto/f_auto/v1780574431/droneshots2_rdkfka.mp4",
  "https://res.cloudinary.com/dgjcl0te0/video/upload/q_auto/f_auto/v1780575852/canyonshots_iln33i.mp4", // ← replace with your second clip
];

const CROSSFADE_DURATION = 1200; // ms — duration of the opacity transition

export default function About() {
  const sectionRef = useRef(null);
  const logoRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const logoInView = useInView(logoRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // ── Video crossfade logic ──────────────────────────────────────────────────
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = [useRef(null), useRef(null)];
  const crossfadingRef = useRef(false);

  // Preload the inactive video so the crossfade is seamless
  useEffect(() => {
    const inactive = videoRefs[activeIndex === 0 ? 1 : 0].current;
    if (inactive) {
      inactive.currentTime = 0;
      inactive.load();
    }
  }, [activeIndex]);

  const handleVideoEnding = (idx) => {
    // "timeupdate" listener — fires ~CROSSFADE_DURATION ms before the end
    return function () {
      const vid = videoRefs[idx].current;
      if (!vid || crossfadingRef.current) return;
      if (vid.duration - vid.currentTime <= CROSSFADE_DURATION / 1000) {
        crossfadingRef.current = true;

        const nextIdx = idx === 0 ? 1 : 0;
        const nextVid = videoRefs[nextIdx].current;
        if (nextVid) {
          nextVid.currentTime = 0;
          nextVid.play().catch(() => {});
        }

        // Switch active after the crossfade
        setTimeout(() => {
          setActiveIndex(nextIdx);
          crossfadingRef.current = false;
        }, CROSSFADE_DURATION);
      }
    };
  };

  useEffect(() => {
    const handlers = videoRefs.map((ref, idx) => {
      const handler = handleVideoEnding(idx);
      ref.current?.addEventListener("timeupdate", handler);
      return handler;
    });

    return () => {
      videoRefs.forEach((ref, idx) => {
        ref.current?.removeEventListener("timeupdate", handlers[idx]);
      });
    };
  }, []);
  // ─────────────────────────────────────────────────────────────────────────

  const sharedVideoStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "brightness(0.45) saturate(0.9)",
    zIndex: 0,
    transition: `opacity ${CROSSFADE_DURATION}ms ease`,
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        position: "relative",
        background: "#080808",
        overflow: "hidden",
        padding: "140px 0 160px",
      }}
    >
      {/* ── Video A ── */}
      <video
        ref={videoRefs[0]}
        autoPlay
        muted
        playsInline
        preload="auto"
        style={{ ...sharedVideoStyle, opacity: activeIndex === 0 ? 1 : 0 }}
      >
        <source src={VIDEO_SRCS[0]} type="video/mp4" />
      </video>

      {/* ── Video B ── */}
      <video
        ref={videoRefs[1]}
        muted
        playsInline
        preload="auto"
        style={{ ...sharedVideoStyle, opacity: activeIndex === 1 ? 1 : 0 }}
      >
        <source src={VIDEO_SRCS[1]} type="video/mp4" />
      </video>

      {/* Dark gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(8,8,8,0.4) 0%, rgba(8,8,8,0.2) 50%, rgba(8,8,8,0.55) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Ambient background glow */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(201,168,76,0.04) 0%, transparent 70%)",
          y: bgY,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Grain texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundSize: "180px",
          opacity: 0.4,
          pointerEvents: "none",
          zIndex: 3,
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 40px",
          position: "relative",
          zIndex: 4,
        }}
      >
        {/* ── Section label ── */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#c9a84c",
            marginBottom: 32,
          }}
        >
          Who We Are
        </motion.p>

        {/* ── Logo + Come Make We Go ── */}
        <motion.div
          ref={logoRef}
          initial={{ opacity: 0, y: 40 }}
          animate={logoInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
            marginBottom: 80,
          }}
        >
          <img
            src="https://res.cloudinary.com/dgjcl0te0/image/upload/f_auto,q_auto/cmwg/cmwg-logo.png"
            alt="CMWG Logo"
            style={{
              height: 120,
              width: 120,
              objectFit: "contain",
              flexShrink: 0,
            }}
          />
          <div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(36px, 5vw, 72px)",
                fontWeight: 400,
                lineHeight: 1.1,
                color: "#fff",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              Come Make We Go
            </h2>
          </div>
        </motion.div>

        {/* ── Divider ── */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={logoInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, #c9a84c 0%, rgba(201,168,76,0.2) 60%, transparent 100%)",
            marginBottom: 80,
            transformOrigin: "left",
          }}
        />

        {/* ── Main copy + pillars grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px 80px",
            alignItems: "start",
          }}
        >
          {/* Left: mission statement */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 400,
                lineHeight: 1.2,
                color: "#fff",
                marginBottom: 28,
                letterSpacing: "-0.01em",
              }}
            >
              We exist to make sure you actually{" "}
              <em style={{ color: "#c9a84c", fontStyle: "italic" }}>go.</em>
            </h2>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 16,
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.55)",
                marginBottom: 20,
              }}
            >
              How many times have you said "I want to travel" and let it stay a dream? CMWG —{" "}
              <strong style={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
                Come Make We Go
              </strong>{" "}
              — was built as an invitation, a challenge, and a promise all at once.
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 16,
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.55)",
                marginBottom: 20,
              }}
            >
              We plan the trips so you don't have to. You just show up, be present, and leave
              changed. From the beaches of West Africa to the souks of Marrakech, every destination
              we choose is somewhere that demands you feel something.
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 16,
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.55)",
              }}
            >
              This isn't a travel agency. It's a movement for people who are done waiting for the
              right time.
            </p>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                marginTop: 40,
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: "transparent",
                border: "1px solid #c9a84c",
                color: "#c9a84c",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "16px 32px",
                cursor: "pointer",
                transition: "background 0.3s, color 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#c9a84c";
                e.currentTarget.style.color = "#080808";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#c9a84c";
              }}
            >
              See Destinations
              <span style={{ fontSize: 16 }}>→</span>
            </motion.button>
          </motion.div>

          {/* Right: pillars */}
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.4 + i * 0.12 }}
                style={{
                  display: "flex",
                  gap: 24,
                  padding: "28px 28px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.02)",
                  backdropFilter: "blur(8px)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Gold left accent */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    background: "linear-gradient(180deg, #c9a84c 0%, transparent 100%)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 28,
                    color: "#c9a84c",
                    lineHeight: 1,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {p.icon}
                </span>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#fff",
                      marginBottom: 10,
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      lineHeight: 1.75,
                      color: "rgba(255,255,255,0.5)",
                      margin: 0,
                    }}
                  >
                    {p.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Bottom tagline ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
          style={{
            marginTop: 100,
            textAlign: "center",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: 60,
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(22px, 3vw, 38px)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.02em",
            }}
          >
            "The world is too big to stay in one place."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
