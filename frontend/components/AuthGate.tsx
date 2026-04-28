"use client";

import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { ReactNode } from "react";

export default function AuthGate({
  children,
  hasData,
}: {
  children: ReactNode;
  hasData?: boolean;
}) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <p className="p-6">Loading...</p>;
  }

  // ❌ NOT LOGGED IN
  if (!isSignedIn) {
    return (
      <div className="p-6 flex justify-center">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="mb-4 font-bold">You must sign in</h2>
          <SignInButton />
        </div>
      </div>
    );
  }

  // 🟡 LOGGED IN BUT NO DATA (ONBOARDING STATE)
  if (hasData === false) {
    return (
      <div>
        <div className="flex justify-end p-4">
          <UserButton />
        </div>

        <div className="p-6 bg-white rounded-xl shadow text-center">
          <h2 className="font-bold text-lg">Welcome to Revenue AI 🚀</h2>
          <p className="text-gray-500 mb-4">
            Add your first product to generate insights
          </p>

          <button className="bg-black text-white px-4 py-2 rounded">
            Add Product
          </button>
        </div>
      </div>
    );
  }

  // ✅ LOGGED IN + HAS DATA
  return (
    <div>
      <div className="flex justify-end p-4">
        <UserButton />
      </div>

      {children}
    </div>
  );
}