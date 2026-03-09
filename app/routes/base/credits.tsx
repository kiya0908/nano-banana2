import { useLoaderData, useOutletContext } from "react-router";
import type { Route } from "./+types/credits";
import type { User, CreditRecord } from "~/.server/libs/db";
import { listCreditRecordsByUser } from "~/.server/model/credit_record";
import { getSessionHandler } from "~/.server/libs/session";
import { redirect } from "react-router";

export const loader = async ({ request }: Route.LoaderArgs) => {
    const [session] = await getSessionHandler(request);
    const user = session.get("user");
    if (!user) throw redirect("/?login=true");

    const records = await listCreditRecordsByUser(user.id);
    return { records };
};

export default function Credits({ loaderData }: Route.ComponentProps) {
    const { user } = useOutletContext<{ user: User }>();
    const { records } = loaderData;

    const getBalance = () => {
        if (!records || records.length === 0) return 0;
        // Assuming the first or latest record contains the total remaining credits
        // Actually getCreditRecordsByUserId returns all records. You would sum them or use remaining_credits of the latest
        return records[0]?.remaining_credits || 0;
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Credits & History</h2>
                <p className="text-base-content/70 mt-1">View your credit balance and usage history.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-primary text-primary-content p-6 rounded-xl md:col-span-1 shadow-sm">
                    <h3 className="text-lg font-medium opacity-80">Current Balance</h3>
                    <div className="mt-4 flex items-baseline text-4xl font-extrabold">
                        {getBalance()}
                        <span className="ml-2 text-xl font-medium opacity-80">credits</span>
                    </div>
                    <a href="/#pricing" className="btn btn-neutral btn-sm mt-6">Buy Credits</a>
                </div>

                <div className="bg-base-100 p-6 rounded-xl border border-base-200 md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Credits</th>
                                    <th>Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records && records.length > 0 ? (
                                    records.map((record: any) => (
                                        <tr key={record.id}>
                                            <td>{new Date(record.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge ${record.credits > 0 ? "badge-success" : "badge-ghost"}`}>
                                                    {record.trans_type}
                                                </span>
                                            </td>
                                            <td className={record.credits > 0 ? "text-success" : "text-base-content"}>
                                                {record.credits > 0 ? `+${record.credits}` : record.credits}
                                            </td>
                                            <td>{record.remaining_credits}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4 text-base-content/50">
                                            No matching records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
