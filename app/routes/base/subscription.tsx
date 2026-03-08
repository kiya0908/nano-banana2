import { useOutletContext, Link } from "react-router";
import type { Route } from "./+types/subscription";
import type { User, Subscription } from "~/.server/libs/db";
import { getActiveSubscriptionsByUserId } from "~/.server/model/subscriptions";
import { getSessionHandler } from "~/.server/libs/session";
import { redirect } from "react-router";

export const loader = async ({ request }: Route.LoaderArgs) => {
    const [session] = await getSessionHandler(request);
    const user = session.get("user");
    if (!user) throw redirect("/?login=true");

    let subscription = null;
    try {
        subscription = await getActiveSubscriptionsByUserId(user.id);
    } catch (error) {
        console.error("Subscription table might not exist or function missing");
    }

    return { subscription };
};

export default function SubscriptionPage({ loaderData }: Route.ComponentProps) {
    const { user } = useOutletContext<{ user: User }>();
    const { subscription } = loaderData;

    const isActive = subscription?.status === "active";

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Subscription</h2>
                <p className="text-base-content/70 mt-1">Manage your active plans and billing.</p>
            </div>

            <div className="bg-base-100 p-6 rounded-xl border border-base-200">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Current Plan</h3>
                        <div className="flex items-center gap-3">
                            <span className={`badge ${isActive ? "badge-success" : "badge-ghost"}`}>
                                {isActive ? "Pro Member" : "Free Plan"}
                            </span>
                            {isActive && (
                                <span className="text-sm text-base-content/70">
                                    Renews on {new Date(subscription.current_period_end).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {isActive ? (
                            <button className="btn btn-outline" onClick={() => alert("Redirect to customer portal")}>
                                Manage Billing
                            </button>
                        ) : (
                            <a href="/#pricing" className="btn btn-primary">
                                Upgrade to Pro
                            </a>
                        )}
                    </div>
                </div>

                {!isActive && (
                    <div className="mt-8 bg-base-200/50 p-6 rounded-lg text-center">
                        <h4 className="font-medium text-lg mb-2">Upgrade for fewer limits</h4>
                        <p className="text-base-content/70 text-sm mb-4 max-w-md mx-auto">
                            Get more compute credits per month, faster generations, and exclusive access to the latest models.
                        </p>
                        <a href="/#pricing" className="text-primary font-medium hover:underline">
                            View all plans &rarr;
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
