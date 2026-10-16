"use client";

import { useEffect, useState } from "react";

export function ClockWidget() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // Mount-guarded initial time avoids hydration mismatch (intentional sync set on mount).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  const time = now
    ? new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Dhaka",
      }).format(now)
    : "--:--";
  const date = now
    ? new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "Asia/Dhaka",
      }).format(now)
    : "Loading local time";
  return (
    <div className="widget-clock" aria-live="off">
      <p className="widget-time mono">{time}</p>
      <p className="widget-date">{date} · Dhaka (UTC+6)</p>
    </div>
  );
}
