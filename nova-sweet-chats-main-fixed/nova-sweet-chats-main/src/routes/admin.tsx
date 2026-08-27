import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import {
  BarChart3,
  Cake,
  ClipboardList,
  FileText,
  LogOut,
  Mail,
  Menu,
  Package,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const navigation = [
  {
    label: "Overview",
    to: "/admin",
    icon: BarChart3,
  },
  {
    label: "Products",
    to: "/admin/products",
    icon: Cake,
  },
  {
    label: "Orders",
    to: "/admin/orders",
    icon: ClipboardList,
  },
  {
    label: "Order Items",
    to: "/admin/order-items",
    icon: Package,
  },
  {
    label: "Contact Forms",
    to: "/admin/contacts",
    icon: Mail,
  },
];

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate({
          to: "/admin/login",
        });

        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        await supabase.auth.signOut();

        navigate({
          to: "/admin/login",
        });

        return;
      }

      setCheckingAuth(false);
    }

    checkAdmin();
  }, [navigate]);

  async function logout() {
    await supabase.auth.signOut();

    navigate({
      to: "/admin/login",
    });
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBF7F3]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D8C0B9] border-t-[#59433B]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF8F5] text-[#40332E]">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 border-r border-[#E9DDD7]
          bg-[#FFFDFC] transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[#EEE3DE] px-7 py-6">
            <div>
              <div className="font-serif text-xl text-[#473732]">
                N.Y Nova
              </div>

              <div className="text-[11px] uppercase tracking-[0.2em] text-[#A58F87]">
                Cake Studio
              </div>
            </div>

            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => {
              const Icon = item.icon;

              const active =
                location.pathname === item.to ||
                (
                  item.to !== "/admin" &&
                  location.pathname.startsWith(item.to)
                );

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 rounded-xl px-4 py-3
                    text-sm font-medium transition
                    ${
                      active
                        ? "bg-[#F3E5E0] text-[#65463E]"
                        : "text-[#806F68] hover:bg-[#FAF3F0] hover:text-[#4D3933]"
                    }
                  `}
                >
                  <Icon size={19} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[#EEE3DE] p-4">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#806F68] transition hover:bg-[#FAF3F0]"
            >
              <LogOut size={19} />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center border-b border-[#E9DDD7] bg-[#FFFDFC]/90 px-5 backdrop-blur lg:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="mr-4 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.16em] text-[#A18E86]">
              Studio Dashboard
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFDCD6] font-serif text-[#684940]">
            N
          </div>
        </header>

        <div className="p-5 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}