import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { Mail, MapPin, Phone } from "lucide-react";

type SocialItem = {
  id?: string;
  platform: string;
  url: string;
};

type ContactInfo = {
  address?: string;
  phone?: string;
  email?: string;
};

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  youtube: FaYoutube,
  tiktok: FaTiktok,
};

function normalizePlatform(platform: string) {
  return platform.trim().toLowerCase().replace(/\s+/g, "");
}

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Albums", href: "/albums" },
  { name: "Packages", href: "/packages" },
  { name: "FAQ", href: "/faq" },
  { name: "Booking", href: "/booking" },
];

type Props = {
  contact?: ContactInfo;
  socials?: SocialItem[];
  
};

export default function Footer({
  contact = {},
  socials = [],
}: Props) {
  const displaySocials =
    socials.filter((s) => s?.url && s.url !== "#").length > 0
      ? socials.filter((s) => s?.url && s.url !== "#")
      : [
          { platform: "facebook", url: "#" },
          { platform: "instagram", url: "#" },
          { platform: "youtube", url: "#" },
        ];

  return (
    <footer className="border-t border-white/10 bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block">
              <Image
                src="/footerlogo.png"
                alt="Sekele"
                width={220}
                height={80}
                className="h-12 w-auto object-contain md:h-14"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
              Wedding photography from Bangladesh. We capture the quiet glances,
              the loud laughter, and the real story of your day.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {displaySocials.map((s) => {
                const key = normalizePlatform(s.platform);
                const Icon = iconMap[key] || FaInstagram;
                return (
                  <a
                    key={s.id || s.platform + s.url}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-rose-500/40 hover:bg-rose-600/15 hover:text-rose-400"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/65 transition-colors hover:text-rose-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 lg:col-start-9">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              Get in touch
            </h3>
            <ul className="mt-5 space-y-4">
              {contact.address && (
                <li className="flex gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-rose-500/80" />
                  <span className="text-sm leading-relaxed text-white/65">
                    {contact.address}
                  </span>
                </li>
              )}
              {contact.phone && (
                <li className="flex gap-3">
                  <Phone size={16} className="mt-0.5 shrink-0 text-rose-500/80" />
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                    className="text-sm text-white/65 transition-colors hover:text-rose-400"
                  >
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.email && (
                <li className="flex gap-3">
                  <Mail size={16} className="mt-0.5 shrink-0 text-rose-500/80" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm text-white/65 transition-colors hover:text-rose-400"
                  >
                    {contact.email}
                  </a>
                </li>
              )}
              {!contact.address && !contact.phone && !contact.email && (
                <li className="text-sm text-white/40">Contact details coming soon.</li>
              )}
            </ul>
            <Link
              href="/booking"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700"
            >
              Book a session
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} Sekele. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-white/30">
            <p>
              Developed by Nur-Nayeem
            </p>
            <span className="text-white/15">·</span>
  <Link href="/admin/login" className="transition hover:text-white/50">
    Admin
  </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}