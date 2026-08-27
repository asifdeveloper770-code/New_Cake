import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  ChevronDown,
  Package,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/order-items")({
  component: OrderItemsPage,
});

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
  orders:
    | {
        id: string;
        customer_name: string;
        customer_email: string | null;
        status: string;
        delivery_date: string | null;
        created_at: string;
      }
    | null;
};

const statuses = [
  "all",
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

function OrderItemsPage() {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [expandedOrder, setExpandedOrder] =
    useState<string | null>(null);

  async function loadOrderItems() {
    setLoading(true);

    const { data, error } = await supabase
      .from("order_items")
      .select(`
        id,
        order_id,
        product_id,
        product_name,
        quantity,
        unit_price,
        total,
        created_at,
        orders (
          id,
          customer_name,
          customer_email,
          status,
          delivery_date,
          created_at
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Failed to load order items:",
        error
      );
      setItems([]);
    } else {
      setItems((data as unknown as OrderItem[]) || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadOrderItems();
  }, []);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesStatus =
        status === "all" ||
        item.orders?.status === status;

      const matchesSearch =
        !query ||
        item.product_name
          .toLowerCase()
          .includes(query) ||
        item.orders?.customer_name
          ?.toLowerCase()
          .includes(query) ||
        item.orders?.customer_email
          ?.toLowerCase()
          .includes(query) ||
        item.order_id
          .toLowerCase()
          .includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [items, search, status]);

  const totalUnits = filteredItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const totalValue = filteredItems.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  const groupedOrders = useMemo(() => {
    const groups = new Map<
      string,
      {
        order: NonNullable<OrderItem["orders"]>;
        items: OrderItem[];
      }
    >();

    for (const item of filteredItems) {
      if (!item.orders) continue;

      if (!groups.has(item.order_id)) {
        groups.set(item.order_id, {
          order: item.orders,
          items: [],
        });
      }

      groups.get(item.order_id)!.items.push(item);
    }

    return Array.from(groups.entries());
  }, [filteredItems]);

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-[#A18E86]">
          Sales breakdown
        </p>

        <h1 className="mt-1 font-serif text-3xl text-[#40332E] lg:text-4xl">
          Order Items
        </h1>

        <p className="mt-2 text-sm text-[#8D7B74]">
          See exactly which cakes and products are included
          in every order.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          label="Order Items"
          value={filteredItems.length}
        />

        <SummaryCard
          label="Total Units"
          value={totalUnits}
        />

        <SummaryCard
          label="Item Value"
          value={`$${totalValue.toFixed(2)}`}
        />
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AA9992]"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search customer, product or order..."
            className="w-full rounded-xl border border-[#E6DAD5] bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#B2A29B] focus:border-[#B99389] focus:ring-2 focus:ring-[#F0E1DC]"
          />
        </div>

        <div className="relative">
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="w-full appearance-none rounded-xl border border-[#E6DAD5] bg-white py-3 pl-4 pr-10 text-sm capitalize text-[#67534C] outline-none focus:border-[#B99389] lg:w-48"
          >
            {statuses.map((itemStatus) => (
              <option
                key={itemStatus}
                value={itemStatus}
              >
                {itemStatus === "all"
                  ? "All statuses"
                  : itemStatus}
              </option>
            ))}
          </select>

          <ChevronDown
            size={17}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9A8880]"
          />
        </div>
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {loading ? (
          <div className="rounded-2xl border border-[#E9DDD7] bg-white py-20 text-center text-sm text-[#95837B]">
            Loading order items...
          </div>
        ) : groupedOrders.length === 0 ? (
          <div className="rounded-2xl border border-[#E9DDD7] bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F5E8E4] text-[#876258]">
              <Package size={23} />
            </div>

            <h3 className="mt-4 font-serif text-xl text-[#40332E]">
              No order items found
            </h3>

            <p className="mt-1 text-sm text-[#95837B]">
              Order products will appear here when customers
              place orders.
            </p>
          </div>
        ) : (
          groupedOrders.map(([orderId, group]) => {
            const isExpanded =
              expandedOrder === orderId;

            const orderTotal = group.items.reduce(
              (sum, item) =>
                sum + Number(item.total || 0),
              0
            );

            const quantity = group.items.reduce(
              (sum, item) =>
                sum + Number(item.quantity || 0),
              0
            );

            return (
              <div
                key={orderId}
                className="overflow-hidden rounded-2xl border border-[#E9DDD7] bg-white"
              >
                {/* Order header */}
                <button
                  onClick={() =>
                    setExpandedOrder(
                      isExpanded ? null : orderId
                    )
                  }
                  className="w-full text-left"
                >
                  <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5E8E4] text-[#805B51]">
                        <Package size={19} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-[#463630]">
                            Order #
                            {orderId.slice(0, 8).toUpperCase()}
                          </span>

                          <StatusBadge
                            status={
                              group.order.status
                            }
                          />
                        </div>

                        <p className="mt-1 text-sm text-[#806F68]">
                          {group.order.customer_name}
                        </p>

                        {group.order.customer_email && (
                          <p className="text-xs text-[#A18E86]">
                            {group.order.customer_email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-8 lg:justify-end">
                      <div className="text-left lg:text-right">
                        <p className="text-xs text-[#A18E86]">
                          {quantity}{" "}
                          {quantity === 1
                            ? "item"
                            : "items"}
                        </p>

                        <p className="mt-1 font-medium text-[#463630]">
                          ${orderTotal.toFixed(2)}
                        </p>
                      </div>

                      <ChevronDown
                        size={18}
                        className={`text-[#8E7B73] transition-transform ${
                          isExpanded
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </div>
                  </div>
                </button>

                {/* Expanded items */}
                {isExpanded && (
                  <div className="border-t border-[#EEE3DE] bg-[#FFFCFA]">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#EEE3DE] text-left text-xs uppercase tracking-wider text-[#A18E86]">
                            <th className="px-6 py-3">
                              Product
                            </th>

                            <th className="px-6 py-3">
                              Quantity
                            </th>

                            <th className="px-6 py-3">
                              Unit Price
                            </th>

                            <th className="px-6 py-3 text-right">
                              Total
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {group.items.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b border-[#F1E9E5] last:border-0"
                            >
                              <td className="px-6 py-4">
                                <div className="font-medium text-[#4B3933]">
                                  {item.product_name}
                                </div>

                                {item.product_id && (
                                  <div className="mt-1 text-[11px] text-[#AA9992]">
                                    Product ID:{" "}
                                    {item.product_id.slice(
                                      0,
                                      8
                                    )}
                                  </div>
                                )}
                              </td>

                              <td className="px-6 py-4 text-sm text-[#806F68]">
                                {item.quantity}
                              </td>

                              <td className="px-6 py-4 text-sm text-[#806F68]">
                                $
                                {Number(
                                  item.unit_price
                                ).toFixed(2)}
                              </td>

                              <td className="px-6 py-4 text-right font-medium text-[#4B3933]">
                                $
                                {Number(
                                  item.total
                                ).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-[#EEE3DE] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#8E7B73]">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          Ordered{" "}
                          {formatDate(
                            group.order.created_at
                          )}
                        </span>

                        {group.order.delivery_date && (
                          <span>
                            Delivery:{" "}
                            {formatDeliveryDate(
                              group.order.delivery_date
                            )}
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-[#A18E86]">
                          Items subtotal
                        </span>

                        <p className="text-lg font-semibold text-[#463630]">
                          ${orderTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-[#E9DDD7] bg-white p-5">
      <p className="text-sm text-[#95837B]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-[#40332E]">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    pending: "bg-[#F7EBD9] text-[#916A3E]",
    confirmed: "bg-[#E9E6F4] text-[#665B8B]",
    preparing: "bg-[#F5E4DD] text-[#8A594C]",
    ready: "bg-[#E6F1E8] text-[#55765D]",
    completed: "bg-[#E1EEE5] text-[#4F7159]",
    cancelled: "bg-[#F0E5E4] text-[#8A5C58]",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDeliveryDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}