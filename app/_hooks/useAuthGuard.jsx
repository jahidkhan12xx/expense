"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuthGuard() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait until Clerk finishes loading
    if (!isLoaded) return;

    // If not signed in, redirect once
    if (!isSignedIn) {
      router.replace("/sign-in");
      return; // exit early to avoid setting isChecking
    }

    // User is signed in, stop loading
    setIsChecking(false);
  }, [isLoaded, isSignedIn, router]);

  return { isChecking };
}
