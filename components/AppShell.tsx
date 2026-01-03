import Link from 'next/link';
import React from 'react';

export function AppShell({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <div className="font-semibold">{title}</div>
          <nav className="flex gap-4 text-sm">
            <Link href="/org" className="hover:underline">Org</Link>
            <Link href="/plan" className="hover:underline">Plan</Link>
            <Link href="/ideas" className="hover:underline">Ideas</Link>
            <Link href="/generate" className="hover:underline">Generate</Link>
            <Link href="/calendar" className="hover:underline">Calendar</Link>
            <Link href="/publish" className="hover:underline">Publish</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-4">{children}</main>
    </div>
  );
}
