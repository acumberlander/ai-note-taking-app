"use client";

import React from "react";
import Image from "next/image";

type RefreshButtonProps = {
  onClick: () => void;
};

export default function RefreshButton({ onClick }: RefreshButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-white hover:bg-blue-400 transition"
      aria-label="Refresh"
    >
      <Image src={"/refresh.png"} alt="refresh" width={30} height={30} />
    </button>
  );
}
