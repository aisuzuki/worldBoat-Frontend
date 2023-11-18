import React from "react";
import Link from "next/link";


/**
 * Site footer
 */
export const Footer = () => {
  return (
    <footer className="py-5 px-1 bg-blue-100 w-full">
      <div className="max-w-screen-xl mx-auto text-center">
        <ul className="menu menu-horizontal justify-center items-center gap-2 text-sm">
          {/* Footer links */}
          <li><Link href="/" className="link link-hover">Home</Link></li>
          <li>·</li>
          <li><Link href="/actions" className="link link-hover">Climate Actions</Link></li>
          <li>·</li>
          <li><Link href="/community" className="link link-hover">Community Forum</Link></li>
          <li>·</li>
          <li><Link href="/about" className="link link-hover">Github</Link></li>
        </ul>

      </div>
    </footer>
  );
};
