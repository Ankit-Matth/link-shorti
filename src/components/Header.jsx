"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gem, Menu, X, Mail } from "lucide-react";
import { getSession, useSession } from "next-auth/react";

const NavLink = ({ href, children, onClick, isMobile }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative transition-colors duration-300 ${
        isMobile
          ? `block px-4 py-3 text-lg rounded-md ${isActive ? 'bg-gray-800 text-cyan-400 font-medium' : 'text-gray-200 hover:bg-gray-800 font-normal'}`
          : `pb-1 hover:text-cyan-400 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-cyan-500 after:transition-all after:duration-300 hover:after:w-full ${isActive ? 'text-cyan-400 font-medium' : 'text-gray-300 font-normal'}`
      }`}
    >
      {children}
    </Link>
  );
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    getSession().then(session => {
      setIsLoggedIn(!!session);
    });
  }, []);
  
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/payout-rates", label: "Payout Rates" },
    { href: "/payment-proofs", label: "Payment Proofs" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/faqs", label: "FAQs" },
  ];

  const AuthButtons = ({ isMobile }) => (
    <div
      className={
        isMobile ? "mt-8 grid gap-4" : "hidden md:flex items-center gap-4"
      }
    >
      {isLoggedIn ? (
        <Link
          href="/dashboard"
          className={`w-full text-center whitespace-nowrap rounded-full bg-cyan-500 px-5 py-2 font-bold text-black transition-colors hover:bg-cyan-400 ${
            isMobile ? "text-lg py-3" : "text-sm"
          }`}
          onClick={isMobile ? toggleMenu : undefined}
        >
          Dashboard
        </Link>
      ) : (
        <Link
          href="/join-now"
          className={`w-full text-center whitespace-nowrap rounded-full bg-cyan-500 px-5 py-2 font-bold text-black transition-all duration-300 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20 ${
            isMobile ? "text-lg py-3" : "text-sm"
          }`}
          onClick={isMobile ? toggleMenu : undefined}
        >
          Join Now
        </Link>
      )}
    </div>
  );
  
  const renderHeaderContent = () => {
    return (
      <>
        <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Gem size={28} className="text-cyan-400" />
            <span className="text-2xl font-bold text-white tracking-wider">
              LinkShorti
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <AuthButtons isMobile={false} />

          <button
            className="md:hidden rounded-full p-2 text-gray-300 transition-colors hover:bg-gray-800"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-lg">
            <div className="container mx-auto py-6 px-6">
              <nav className="grid gap-y-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    onClick={toggleMenu}
                    isMobile
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
              <AuthButtons isMobile={true} />
            </div>
          </div>
        )}
      </>
    );
  };
  
  return (
    <>
      {session && !session.user.isEmailVerified && pathname !== "/verify" && (
        <div className="bg-yellow-100 text-yellow-800 py-2 px-4 flex items-center justify-center text-base text-center md:text-left space-x-2">
          <span className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-yellow-500" />
            <span>
              Verify your email to unlock all features and start earning.
            </span>
          </span>
          <Link
            href="/verify"
            className="underline text-base font-medium hover:text-yellow-900"
          >
            Verify Now
          </Link>
        </div>
      )}

      <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-lg border-b border-gray-800">
        {renderHeaderContent()}
      </header>
    </>
  );
}