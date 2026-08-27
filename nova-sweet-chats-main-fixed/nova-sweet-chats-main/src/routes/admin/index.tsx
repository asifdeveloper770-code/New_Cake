import { createFileRoute } from "@tanstack/react-router";
import {
  Cake,
  ClipboardList,
  DollarSign,
  Mail,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/")({
  component: OverviewPage,
});

function OverviewPage() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    contacts: 0,
    revenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const [
      products,
      orders,
      contacts,
      revenue,
      recent,
    ] = await Promise.all([
      supabase
        .from("products")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("orders")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("contact_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "new"),

      supabase
        .from("orders")
        .select("total")
        .neq("status", "cancelled"),

      supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

    const totalRevenue =
      revenue.data?.reduce(
        (sum: number, order: { total: any; }) => sum + Number(order.total || 0),
        0
      ) || 0;

    setStats({
      products: products.count || 0,
      orders: orders.count || 0,
      contacts: contacts.count || 0,
      revenue: totalRevenue,
    });

    setRecentOrders(recent.data || []);
  }

  const cards = [
    {
      label: "Total Products",
      value: stats.products,
      icon: Cake,
    },
    {
      label: "Total Orders",
      value: stats.orders,
      icon: ClipboardList,
    },
    {
      label: "New Messages",
      value: stats.contacts,
      icon: Mail,
    },
    {
      label: "Revenue",
      value: `$${stats.revenue.toFixed(2)}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="text-sm text-[#A18E86]">
          Welcome back
        </p>

        <h1 className="mt-1 font-serif text-3xl text-[#40332E] lg:text-4xl">
          Studio Overview
        </h1>

        <p className="mt-2 text-sm text-[#8D7B74]">
          Here's what's happening with your cake studio.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-2xl border border-[#E9DDD7] bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F6EAE6] text-[#805B51]">
                  <Icon size={21} />
                </div>

                <TrendingUp
                  size={17}
                  className="text-[#B79B91]"
                />
              </div>

              <div className="mt-5">
                <p className="text-sm text-[#97857E]">
                  {card.label}
                </p>

                <p className="mt-1 text-2xl font-semibold text-[#40332E]">
                  {card.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-[#E9DDD7] bg-white">
        <div className="border-b border-[#EEE3DE] px-6 py-5">
          <h2 className="font-serif text-xl text-[#40332E]">
            Recent Orders
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EEE3DE] text-left text-xs uppercase tracking-wider text-[#A18E86]">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[#F2EAE6] last:border-0"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#4B3933]">
                      {order.customer_name}
                    </div>

                    <div className="text-xs text-[#9B8982]">
                      {order.customer_email || "No email"}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-[#806F68]">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-[#F5EAE6] px-3 py-1 text-xs capitalize text-[#76554C]">
                      {order.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right font-medium text-[#4B3933]">
                    ${Number(order.total).toFixed(2)}
                  </td>
                </tr>
              ))}

              {!recentOrders.length && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-sm text-[#9B8982]"
                  >
                    No orders yet.
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