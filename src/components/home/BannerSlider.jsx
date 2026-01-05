"use client";

import { useEffect, useState } from "react";

export default function BannerSlider({ games = [] }) {
  const [slides, setSlides] = useState(games); // server & eerste render = stabiel
  const [index, setIndex] = useState(0);

  // Shuffle PAS op de client na mount -> geen hydration mismatch
  useEffect(() => {
    if (!games.length) return;

    const shuffled = [...games].sort(() => Math.random() - 0.5);
    setSlides(shuffled);

    // start op random slide
    setIndex(Math.floor(Math.random() * shuffled.length));
  }, [games]);

  // Auto-slide
  useEffect(() => {
    if (!slides.length) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides]);

  if (!slides.length) {
    return <p>Geen games gevonden.</p>;
  }

  const game = slides[index];

  return (
    <div style={{ position: "relative" }}>
      <a
        href={`/games/${game.slug}`}
        style={{
          display: "block",
          borderRadius: 14,
          overflow: "hidden",
          border: "1px solid #232a39",
          position: "relative",
        }}
      >
        <img
          src={game.banner}
          alt={game.title}
          className="slider-img"
          style={{ width: "100%", objectFit: "cover" }}
        />

        {/* overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.65))",
          }}
        />

        {/* text */}
        <div style={{ position: "absolute", left: 16, bottom: 16 }}>
          <h3 style={{ fontSize: 26, margin: 0 }}>{game.title}</h3>
          <p style={{ margin: "4px 0 0 0" }}>{game.tagline}</p>
        </div>
      </a>

      {/* dots */}
      <div
        style={{
          position: "absolute",
          right: 16,
          top: 16,
          display: "flex",
          gap: 6,
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`slide ${i + 1}`}
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              background:
                i === index ? "white" : "rgba(255, 255, 255, 0.35)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
