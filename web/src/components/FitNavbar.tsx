"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const planKey = "fitlog-plan";
const savedKey = "fitlog-saved";

function countItems(key: string) {
  if (typeof window === "undefined") return 0;

  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value.length : 0;
  } catch {
    return 0;
  }
}

export default function FitNavbar() {
  const pathname = usePathname();
  const [planCount, setPlanCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const sync = () => {
      setPlanCount(countItems(planKey));
      setSavedCount(countItems(savedKey));
    };
    sync();
    window.addEventListener("fitlog-storage", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("fitlog-storage", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isPlanPage = pathname === "/my-plan";

  return (
    <header className="fit-navbar">
      <Link className="fit-brand" href="/#top" aria-label="Fitlog home">
        <Image src="/logo.png" alt="" width={25} height={25} priority />
        <span>FITLOG</span>
      </Link>

      <nav className="fit-nav-links" aria-label="Primary navigation">
        <Link className={pathname === "/" ? "fit-nav-link active" : "fit-nav-link"} href="/#library">
          Workouts
        </Link>
        <Link className={isPlanPage ? "fit-nav-link active" : "fit-nav-link"} href="/my-plan">
          My Plan
        </Link>
      </nav>

      <div className="fit-nav-status">
        <Link className="status-link" href="/my-plan?tab=plan">
          Plan <span className="plan-count">{planCount}</span>
        </Link>
        <Link className="status-link saved-status" href="/my-plan?tab=saved">
          Saved <span className="saved-count">{savedCount}</span>
        </Link>
      </div>
    </header>
  );
}

