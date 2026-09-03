"use client";

import { useState } from "react";
import type { ComponentProps } from "react";
import AdminAboutClient from "../about/AdminAboutClient";
import AdminTeamClient from "../team/AdminTeamClient";
import AdminFaqsClient from "../faqs/AdminFaqsClient";
import AdminSlidersClient from "../sliders/AdminSlidersClient";
import AdminStatsClient from "../stats/AdminStatsClient";

const tabs = [
  { id: "slider", label: "Hero slider" },
  { id: "about", label: "About us" },
  { id: "stats", label: "Stats" },
  { id: "faq", label: "FAQ" },
] as const;

type ContentClientProps = {
  requestedTab?: string;
  initialAbout: ComponentProps<typeof AdminAboutClient>["initialData"];
  initialFaqs: ComponentProps<typeof AdminFaqsClient>["initialItems"];
  initialSliders: ComponentProps<typeof AdminSlidersClient>["initialItems"];
  initialStats: ComponentProps<typeof AdminStatsClient>["initialData"];
  initialTeam: ComponentProps<typeof AdminTeamClient>["initialItems"];
};

function ContentTabs({
  requestedTab,
  initialAbout,
  initialFaqs,
  initialSliders,
  initialStats,
  initialTeam,
}: ContentClientProps) {
  const selectedTab = tabs.find((tab) => tab.id === requestedTab);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>(
    selectedTab?.id ?? "slider"
  );
  const [aboutSub, setAboutSub] = useState<"story" | "team">("story");

  return (
    <div className="admin-editor mx-auto max-w-7xl">
      <div className="border-b border-neutral-200 pb-5">
        <p className="text-sm font-medium text-rose-600">Website management</p>
        <h2 className="mt-1 text-2xl font-semibold text-neutral-900">Site content</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Manage homepage visuals, about content, stats, and FAQs.
        </p>
      </div>

      <div className="mt-6 flex w-fit max-w-full gap-1 overflow-x-auto rounded-lg border border-neutral-200 bg-white p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? "bg-neutral-900 text-white"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "slider" && (
          <AdminSlidersClient initialItems={initialSliders} />
        )}

        {activeTab === "about" && (
          <div>
            <div className="mb-6 flex w-fit gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-1">
              <button
                type="button"
                onClick={() => setAboutSub("story")}
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                  aboutSub === "story"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                Our story
              </button>
              <button
                type="button"
                onClick={() => setAboutSub("team")}
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                  aboutSub === "team"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                Our team
              </button>
            </div>
            {aboutSub === "story" ? (
              <AdminAboutClient initialData={initialAbout} />
            ) : (
              <AdminTeamClient initialItems={initialTeam} />
            )}
          </div>
        )}

        {activeTab === "stats" && <AdminStatsClient initialData={initialStats} />}
        {activeTab === "faq" && <AdminFaqsClient initialItems={initialFaqs} />}
      </div>
    </div>
  );
}

export default function ContentClient(props: ContentClientProps) {
  return <ContentTabs {...props} />;
}
