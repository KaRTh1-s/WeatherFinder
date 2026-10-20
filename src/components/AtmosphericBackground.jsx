import React, { useEffect, useRef } from "react";

export const AtmosphericBackground = ({ atmosphere = "clear-day", isDay = true, theme = "dark", motionEnabled = true }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // If reduced motion or disabled, don't run particle animation loop
    const prefersReducedMotion =
      typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? Boolean(window.matchMedia("(prefers-reduced-motion: reduce)")?.matches)
        : false;
    if (!motionEnabled || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle pools
    const particles = [];
    const count = atmosphere === "rain" ? 80 : atmosphere === "snow" ? 50 : atmosphere === "clear-night" ? 65 : 25;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speedY: atmosphere === "rain" ? 6 + Math.random() * 8 : atmosphere === "snow" ? 0.6 + Math.random() * 1.2 : 0.1 + Math.random() * 0.4,
        speedX: atmosphere === "rain" ? -1.5 - Math.random() * 1.5 : (Math.random() - 0.5) * 0.5,
        radius: atmosphere === "snow" ? 1.5 + Math.random() * 2.5 : 1 + Math.random() * 1.5,
        alpha: 0.2 + Math.random() * 0.6,
        alphaDir: (Math.random() - 0.5) * 0.015,
        length: atmosphere === "rain" ? 12 + Math.random() * 16 : 0
      });
    }

    let lightningTimer = 0;
    let isFlashing = false;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Thunderstorm lightning flash simulation
      if (atmosphere === "thunderstorm") {
        lightningTimer++;
        if (lightningTimer > 280 + Math.random() * 200) {
          isFlashing = true;
          lightningTimer = 0;
          setTimeout(() => {
            isFlashing = false;
          }, 90);
        }

        if (isFlashing) {
          ctx.fillStyle = "rgba(186, 230, 253, 0.14)";
          ctx.fillRect(0, 0, width, height);
        }
      }

      // Draw weather particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (atmosphere === "rain") {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(186, 230, 253, ${p.alpha * 0.7})`;
          ctx.lineWidth = 1.2;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 2, p.y + p.length);
          ctx.stroke();

          p.y += p.speedY;
          p.x += p.speedX;
          if (p.y > height) {
            p.y = -p.length;
            p.x = Math.random() * width;
          }
        } else if (atmosphere === "snow") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.8})`;
          ctx.fill();

          p.y += p.speedY;
          p.x += Math.sin(p.y * 0.02) * 0.7;
          if (p.y > height) {
            p.y = -5;
            p.x = Math.random() * width;
          }
        } else if (atmosphere === "clear-night") {
          // Twinkling stars
          p.alpha += p.alphaDir;
          if (p.alpha > 0.85 || p.alpha < 0.15) p.alphaDir *= -1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(224, 242, 254, ${p.alpha})`;
          ctx.fill();
        } else if (atmosphere === "fog") {
          // Floating mist particles
          p.x += p.speedX * 0.3;
          if (p.x > width) p.x = 0;
          if (p.x < 0) p.x = width;

          ctx.beginPath();
          ctx.arc(p.x, p.y, 40 + p.radius * 20, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(148, 163, 184, 0.035)`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [atmosphere, isDay, motionEnabled]);

  return (
    <div className={`atmosphere-container atmosphere-${atmosphere} theme-${theme}`} aria-hidden="true">
      <div className="atmosphere-gradient" />
      <div className="atmosphere-vignette" />
      <canvas ref={canvasRef} className="atmosphere-canvas" />
    </div>
  );
};
