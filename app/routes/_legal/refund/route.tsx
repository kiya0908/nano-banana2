import type { Route } from "./+types/route";

import { Legal } from "~/components/pages/legal";
import { parseMarkdown } from "~/.server/libs/markdown";
import content from "./content.md?raw";

import { createCanonical } from "~/utils/meta";

export const meta: Route.MetaFunction = ({ matches }) => {
    return [
        { title: "Refund Policy - Nano Banana 2" },
        {
            name: "description",
            content:
                "Review the Refund Policy for Nano Banana 2, outlining the conditions and procedures for refunds on our AI-powered platform.",
        },
        createCanonical("/legal/refund", matches[0].data.DOMAIN),
    ];
};

export const loader = ({ }: Route.LoaderArgs) => {
    const { node } = parseMarkdown(content);
    return { node };
};

export default function Page({ loaderData: { node } }: Route.ComponentProps) {
    return <Legal node={node} />;
}
