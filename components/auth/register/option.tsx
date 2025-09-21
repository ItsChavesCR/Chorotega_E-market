"use client";
import Link from "next/link";
import React from "react";

// app/(auth)/register/page.tsx
// Pantalla de selección de tipo de registro, igual a la imagen


export function RoleCard({
  icon,
  title,
  description,
  href,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl bg-neutral-100 p-8 text-center shadow-sm ring-1 ring-black/5">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-white text-neutral-900">
        {icon}
      </div>
      <h3 className="text-xl font-extrabold">{title}</h3>
      <p className="mx-auto mt-2 max-w-xs text-sm text-neutral-600">{description}</p>
      <Link
        href={href}
        className="mt-6 inline-flex w-full justify-center rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
      >
        {cta}
      </Link>
    </div>
  );
}
