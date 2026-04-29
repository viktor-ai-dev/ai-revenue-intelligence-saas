"use client";

import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { ReactNode, useState } from "react";

export default function AuthGate({
  children,
  hasData,
  onSeed,
}: {
  children: ReactNode;
  hasData?: boolean;
  onSeed?: () => Promise<void>;
}) {
  const { isSignedIn, isLoaded } = useUser();
  const [loadingSeed, setLoadingSeed] = useState(false);

  if (!isLoaded) {
    return <p className="p-6 text-gray-500">Loading...</p>;
  }

  // ❌ NOT LOGGED IN
  if (!isSignedIn) {
    return (
      <div className="p-6 flex justify-center items-center h-screen">
        <div className="bg-white p-6 rounded-xl shadow text-center space-y-4">
          <h2 className="font-bold text-xl">Revenue AI</h2>
          <p className="text-gray-500">
            Analyze your business with AI
          </p>
          <SignInButton />
        </div>
      </div>
    );
  }

  // 🟡 ONBOARDING STATE
  if (hasData === false) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-end p-4">
          <UserButton />
        </div>

        <div className="flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-2xl shadow max-w-md w-full text-center space-y-4">

            <h2 className="font-bold text-xl">
              Welcome to Revenue AI 🚀
            </h2>

            <p className="text-gray-500">
              Get instant insights by loading demo data
              or add your own products.
            </p>

            {/* 🔥 PRIMARY CTA */}
            <button
              onClick={async () => {
                if (!onSeed) return;
                setLoadingSeed(true);
                await onSeed();
                setLoadingSeed(false);
              }}
              className="w-full bg-black text-white py-2 rounded"
            >
              {loadingSeed ? "Loading..." : "Load Demo Data"}
            </button>

            {/* SECONDARY CTA */}
            <button className="w-full border py-2 rounded">
              Add Product Manually
            </button>

            <p className="text-xs text-gray-400">
              Demo data helps you explore the AI features instantly
            </p>

          </div>
        </div>
      </div>
    );
  }

  // ✅ NORMAL DASHBOARD
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-end p-4">
        <UserButton />
      </div>

      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
}