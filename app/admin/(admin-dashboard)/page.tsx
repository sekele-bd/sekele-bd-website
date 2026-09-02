import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CircleHelp,
  ExternalLink,
  Film,
  Images,
  LayoutPanelTop,
  Package,
  Plus,
  Share2,
} from "lucide-react";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const [
    albums,
    packages,
    sliders,
    faqs,
    socials,
    films,
    recentAlbums,
    recentPackages,
  ] = await Promise.all([
    prisma.album.count(),
    prisma.package.count(),
    prisma.slider.count(),
    prisma.faq.count(),
    prisma.socialLink.count(),
    prisma.film.count(),
    prisma.album.findMany({
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: { id: true, title: true, updatedAt: true },
    }),
    prisma.package.findMany({
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: { id: true, name: true, updatedAt: true },
    }),
  ]);

  const primaryStats = [
    {
      label: "Portfolio albums",
      value: albums,
      href: "/admin/albums",
      icon: Images,
      note: "Wedding stories in your albums",
    },
    {
      label: "Featured films",
      value: films,
      href: "/admin/films",
      icon: Film,
      note: "YouTube films on the albums page",
    },
    {
      label: "Packages",
      value: packages,
      href: "/admin/packages",
      icon: Package,
      note: "Service packages available to clients",
    },
    {
      label: "Hero slides",
      value: sliders,
      href: "/admin/content?tab=slider",
      icon: LayoutPanelTop,
      note: "Homepage visuals ready to display",
    },
  ];

  const recentItems = [
    ...recentAlbums.map((item) => ({
      ...item,
      label: item.title,
      kind: "Album" as const,
      href: "/admin/albums",
    })),
    ...recentPackages.map((item) => ({
      ...item,
      label: item.name,
      kind: "Package" as const,
      href: "/admin/packages",
    })),
  ]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-5 border-b border-neutral-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-rose-600">Admin workspace</p>
          <h2 className="mt-1 text-2xl font-semibold text-neutral-900">
            Good to see you, {admin.name || "Admin"}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Manage your website content, albums and service offerings from one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-rose-300 hover:text-rose-700"
          >
            <ExternalLink size={16} /> View website
          </Link>
          <Link
            href="/admin/albums"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-rose-300 hover:text-rose-700"
          >
            <Plus size={16} /> New album
          </Link>
          <Link
            href="/admin/films"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-rose-300 hover:text-rose-700"
          >
            <Plus size={16} /> New film
          </Link>
          <Link
            href="/admin/packages"
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700"
          >
            <Plus size={16} /> New package
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {primaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-rose-200 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-neutral-500">{stat.label}</p>
                  <p className="mt-1 text-3xl font-semibold text-neutral-900">{stat.value}</p>
                  <p className="mt-2 text-xs text-neutral-400">{stat.note}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                  <Icon size={18} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-lg border border-neutral-200 bg-white lg:col-span-3">
          <div className="border-b border-neutral-100 px-5 py-4">
            <h3 className="font-semibold text-neutral-900">Recent updates</h3>
            <p className="mt-0.5 text-sm text-neutral-500">Latest albums and packages you changed.</p>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentItems.map((item) => (
              <Link
                key={`${item.kind}-${item.id}`}
                href={item.href}
                className="flex items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-neutral-50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                    {item.kind === "Album" ? <Images size={16} /> : <Package size={16} />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-800">{item.label}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">{item.kind}</p>
                  </div>
                </div>
                <time className="shrink-0 text-xs text-neutral-400">
                  {item.updatedAt.toLocaleDateString()}
                </time>
              </Link>
            ))}
            {!recentItems.length && (
              <p className="px-5 py-12 text-center text-sm text-neutral-500">
                No updates yet. Create your first album or package to get started.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-5 lg:col-span-2">
          <h3 className="font-semibold text-neutral-900">Content status</h3>
          <p className="mt-1 text-sm text-neutral-500">Keep these client touchpoints current.</p>
          <div className="mt-5 space-y-4">
            <Link
              href="/admin/films"
              className="flex items-center gap-3 rounded-md p-2 transition hover:bg-neutral-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                <Film size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-800">Featured films</p>
                <p className="text-xs text-neutral-500">{films} films published</p>
              </div>
              <ArrowRight size={16} className="text-neutral-400" />
            </Link>
            <Link
              href="/admin/content?tab=faq"
              className="flex items-center gap-3 rounded-md p-2 transition hover:bg-neutral-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                <CircleHelp size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-800">Frequently asked questions</p>
                <p className="text-xs text-neutral-500">{faqs} questions published</p>
              </div>
              <ArrowRight size={16} className="text-neutral-400" />
            </Link>
            <Link
              href="/admin/business?tab=socials"
              className="flex items-center gap-3 rounded-md p-2 transition hover:bg-neutral-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                <Share2 size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-800">Social links</p>
                <p className="text-xs text-neutral-500">{socials} links connected</p>
              </div>
              <ArrowRight size={16} className="text-neutral-400" />
            </Link>
            <Link
              href="/admin/business"
              className="flex items-center gap-3 rounded-md p-2 transition hover:bg-neutral-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <LayoutPanelTop size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-800">Contact details</p>
                <p className="text-xs text-neutral-500">Review your phone, email and address</p>
              </div>
              <ArrowRight size={16} className="text-neutral-400" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}