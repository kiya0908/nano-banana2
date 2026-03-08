import { useLoaderData, useOutletContext } from "react-router";
import type { Route } from "./+types/orders";
import type { User, Order } from "~/.server/libs/db";
import { getOrdersByUserId } from "~/.server/model/order";
import { getSessionHandler } from "~/.server/libs/session";
import { redirect } from "react-router";

export const loader = async ({ request }: Route.LoaderArgs) => {
    const [session] = await getSessionHandler(request);
    const user = session.get("user");
    if (!user) throw redirect("/?login=true");

    const orders = await getOrdersByUserId(user.id);
    return { orders };
};

export default function Orders({ loaderData }: Route.ComponentProps) {
    const { user } = useOutletContext<{ user: User }>();
    const { orders } = loaderData;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
                <p className="text-base-content/70 mt-1">Review your past purchases and receipts.</p>
            </div>

            <div className="bg-base-100 p-6 rounded-xl border border-base-200">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders && orders.length > 0 ? (
                                orders.map((order: any) => (
                                    <tr key={order.order_no}>
                                        <td className="font-mono text-sm">{order.order_no}</td>
                                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td>${(order.amount / 100).toFixed(2)}</td>
                                        <td>
                                            <span className={`badge ${order.status === 'paid' ? 'badge-success' :
                                                    order.status === 'pending' ? 'badge-warning' : 'badge-error'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-base-content/50">
                                        You don't have any orders yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
