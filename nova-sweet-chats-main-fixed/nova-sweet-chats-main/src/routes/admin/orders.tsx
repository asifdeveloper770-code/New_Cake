import { createFileRoute } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/orders")({
  component: OrdersPage,
});

const statuses = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    setLoading(true);

    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setOrders(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(
    id: string,
    status: string
  ) {
    await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    loadOrders();
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="text-sm text-[#A18E86]">
          Sales
        </p>

        <h1 className="font-serif text-3xl text-[#40332E]">
          Orders
        </h1>

        <p className="mt-2 text-sm text-[#8D7B74]">
          Track cake orders from payment through completion.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E9DDD7] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EEE3DE] text-left text-xs uppercase tracking-wider text-[#A18E86]">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Order Date</th>
                <th className="px-6 py-4">Delivery</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[#F2EAE6]"
                >
                  <td className="px-6 py-5">
                    <div className="font-medium text-[#463630]">
                      {order.customer_name}
                    </div>

                    <div className="text-xs text-[#98857D]">
                      {order.customer_email}
                    </div>

                    <div className="text-xs text-[#98857D]">
                      {order.customer_phone}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-[#806F68]">
                    {new Date(
                      order.created_at
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-5 text-sm text-[#806F68]">
                    {order.delivery_date || "Pickup"}
                  </td>

                  <td className="px-6 py-5">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(
                          order.id,
                          e.target.value
                        )
                      }
                      className="rounded-lg border border-[#E5DAD5] bg-[#FFFCFA] px-3 py-2 text-xs capitalize outline-none"
                    >
                      {statuses.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-6 py-5 font-medium">
                    ${Number(order.total).toFixed(2)}
                  </td>

                  <td className="px-6 py-5 text-right">
                    <button className="rounded-lg p-2 text-[#806F68] hover:bg-[#F8F0ED]">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && (
            <div className="py-12 text-center text-sm text-[#95837B]">
              Loading orders...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}