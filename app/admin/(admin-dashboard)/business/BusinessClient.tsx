"use client";

import { useState } from "react";
import type { ComponentProps } from "react";
import AdminContactClient from "../booking/AdminContactClient";
import AdminSocialsClient from "../socials/AdminSocialsClient";

type BusinessClientProps = {
  requestedTab?: string;
  initialContact: ComponentProps<typeof AdminContactClient>["initialData"];
  initialSocials: ComponentProps<typeof AdminSocialsClient>["initialItems"];
};

function BusinessTabs({
  requestedTab,
  initialContact,
  initialSocials,
}: BusinessClientProps) {
  const [activeTab, setActiveTab] = useState<"contact" | "socials">(
    requestedTab === "socials" ? "socials" : "contact"
  );

  return (
    <div className="admin-editor mx-auto max-w-7xl">
      <div className="border-b border-neutral-200 pb-5">
        <p className="text-sm font-medium text-rose-600">Business details</p>
        <h2 className="mt-1 text-2xl font-semibold text-neutral-900">
          Contact and social links
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Keep the ways clients reach you accurate and ready to use.
        </p>
      </div>

      <div className="mt-6 flex w-fit gap-1 rounded-lg border border-neutral-200 bg-white p-1">
        {(["contact", "socials"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === tab
                ? "bg-neutral-900 text-white"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
            }`}
          >
            {tab === "socials" ? "Social links" : "Contact details"}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "contact" ? (
          <AdminContactClient initialData={initialContact} />
        ) : (
          <AdminSocialsClient initialItems={initialSocials} />
        )}
      </div>
    </div>
  );
}

export default function BusinessClient(props: BusinessClientProps) {
  return <BusinessTabs {...props} />;
}
