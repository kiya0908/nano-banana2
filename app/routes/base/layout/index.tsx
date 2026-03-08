import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/index";

import { BaseLayout, type BaseLayoutProps } from "~/features/layout";
import { getSessionHandler } from "~/.server/libs/session";
import { Sidebar } from "./components/sidebar";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [session] = await getSessionHandler(request);
  const user = session.get("user");

  if (!user) {
    throw redirect("/?login=true");
  }

  const header: BaseLayoutProps["header"] = {
    navLinks: [
      { label: "AI Generator", to: "/" },
      { label: "Pricing", to: "/#pricing" },
      { label: "FAQs", to: "/#faqs" },
    ],
  };

  const footer: BaseLayoutProps["footer"] = {
    navLinks: [
      {
        label: "Tools",
        list: [{ to: "/", label: "AI Generator" }],
      },
      {
        label: "Support",
        list: [
          {
            to: "mailto:support@nanobanana2pro.space",
            label: "support@nanobanana2pro.space",
            target: "_blank",
          },
        ],
      },
      {
        label: "Legal",
        list: [
          { to: "/legal/terms", label: "Terms of Use", target: "_blank" },
          { to: "/legal/privacy", label: "Privacy Policy", target: "_blank" },
          { to: "/legal/refund", label: "Refund Policy", target: "_blank" },
        ],
      },
    ],
  };

  return { header, footer, user };
};

export default function Layout({
  loaderData: { header, footer, user },
}: Route.ComponentProps) {
  return (
    <BaseLayout header={header} footer={footer}>
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row min-h-[calc(100vh-200px)]">
        <Sidebar />
        <main className="flex-1 min-w-0 md:ml-8 mt-6 md:mt-0">
          <Outlet context={{ user }} />
        </main>
      </div>
    </BaseLayout>
  );
}
