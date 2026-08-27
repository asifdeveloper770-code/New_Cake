import { createFileRoute } from "@tanstack/react-router";
import {
  Archive,
  Check,
  Mail,
  MessageCircle,
  Phone,
  Search,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/contacts")({
  component: ContactFormsPage,
});

type ContactSubmission = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  created_at: string;
};

const statuses = ["all", "new", "read", "replied", "archived"] as const;

function ContactFormsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<(typeof statuses)[number]>("all");
  const [selectedContact, setSelectedContact] =
    useState<ContactSubmission | null>(null);

  async function loadContacts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load contacts:", error);
      setContacts([]);
    } else {
      setContacts((data as ContactSubmission[]) || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadContacts();
  }, []);

  async function updateStatus(
    id: string,
    status: ContactSubmission["status"]
  ) {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Failed to update contact:", error);
      return;
    }

    setContacts((current) =>
      current.map((contact) =>
        contact.id === id
          ? { ...contact, status }
          : contact
      )
    );

    if (selectedContact?.id === id) {
      setSelectedContact({
        ...selectedContact,
        status,
      });
    }
  }

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return contacts.filter((contact) => {
      const matchesStatus =
        statusFilter === "all" ||
        contact.status === statusFilter;

      const matchesSearch =
        !query ||
        contact.name.toLowerCase().includes(query) ||
        contact.email?.toLowerCase().includes(query) ||
        contact.phone?.toLowerCase().includes(query) ||
        contact.subject?.toLowerCase().includes(query) ||
        contact.message.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [contacts, search, statusFilter]);

  const newCount = contacts.filter(
    (contact) => contact.status === "new"
  ).length;

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-[#A18E86]">
          Customer communication
        </p>

        <div className="mt-1 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-serif text-3xl text-[#40332E] lg:text-4xl">
              Contact Forms
            </h1>

            <p className="mt-2 text-sm text-[#8D7B74]">
              Manage inquiries and messages from your customers.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-[#F5E8E4] px-4 py-2 text-sm text-[#76544B]">
            <Mail size={16} />
            <span>
              {newCount} new{" "}
              {newCount === 1 ? "message" : "messages"}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AA9992]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search messages..."
            className="w-full rounded-xl border border-[#E6DAD5] bg-white py-3 pl-11 pr-4 text-sm text-[#40332E] outline-none transition placeholder:text-[#B2A29B] focus:border-[#B99389] focus:ring-2 focus:ring-[#F0E1DC]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto rounded-xl border border-[#E6DAD5] bg-white p-1">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`
                whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium capitalize transition
                ${
                  statusFilter === status
                    ? "bg-[#4A3934] text-white"
                    : "text-[#806F68] hover:bg-[#F8F0ED]"
                }
              `}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="overflow-hidden rounded-2xl border border-[#E9DDD7] bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-sm text-[#95837B]">
            Loading messages...
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5E8E4] text-[#876258]">
              <Mail size={23} />
            </div>

            <h3 className="mt-4 font-serif text-xl text-[#40332E]">
              No messages found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-[#95837B]">
              Contact form submissions will appear here.
            </p>
          </div>
        ) : (
          <div>
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="border-b border-[#F1E9E5] p-5 last:border-0 transition hover:bg-[#FFFCFA] lg:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                  {/* Avatar */}
                  <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F2E3DE] text-[#76544B] sm:flex">
                    <User size={19} />
                  </div>

                  {/* Main content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium text-[#463630]">
                        {contact.name}
                      </h3>

                      <StatusBadge status={contact.status} />
                    </div>

                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#98857D]">
                      {contact.email && (
                        <span className="inline-flex items-center gap-1.5">
                          <Mail size={13} />
                          {contact.email}
                        </span>
                      )}

                      {contact.phone && (
                        <span className="inline-flex items-center gap-1.5">
                          <Phone size={13} />
                          {contact.phone}
                        </span>
                      )}
                    </div>

                    {contact.subject && (
                      <p className="mt-4 font-medium text-[#5B4640]">
                        {contact.subject}
                      </p>
                    )}

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#806F68]">
                      {contact.message}
                    </p>

                    <div className="mt-4 text-xs text-[#A39189]">
                      {formatDate(contact.created_at)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedContact(contact);

                        if (contact.status === "new") {
                          updateStatus(contact.id, "read");
                        }
                      }}
                      className="rounded-lg border border-[#E6DAD5] px-3 py-2 text-xs font-medium text-[#72564D] transition hover:bg-[#F8F0ED]"
                    >
                      View
                    </button>

                    {contact.status !== "replied" &&
                      contact.status !== "archived" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              contact.id,
                              "replied"
                            )
                          }
                          title="Mark as replied"
                          className="rounded-lg border border-[#E6DAD5] p-2 text-[#806F68] transition hover:bg-[#F8F0ED]"
                        >
                          <Check size={16} />
                        </button>
                      )}

                    {contact.status !== "archived" && (
                      <button
                        onClick={() =>
                          updateStatus(
                            contact.id,
                            "archived"
                          )
                        }
                        title="Archive"
                        className="rounded-lg border border-[#E6DAD5] p-2 text-[#806F68] transition hover:bg-[#F8F0ED]"
                      >
                        <Archive size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2E211D]/30 p-4 backdrop-blur-sm"
          onClick={() => setSelectedContact(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#E6DAD5] bg-[#FFFDFC] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-[#EEE3DE] px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#A18E86]">
                    Customer Message
                  </p>

                  <h2 className="mt-1 font-serif text-2xl text-[#40332E]">
                    {selectedContact.name}
                  </h2>
                </div>

                <StatusBadge
                  status={selectedContact.status}
                />
              </div>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {selectedContact.email && (
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="rounded-xl border border-[#E9DDD7] bg-white p-4 transition hover:bg-[#FAF4F1]"
                  >
                    <div className="flex items-center gap-2 text-xs text-[#A18E86]">
                      <Mail size={14} />
                      Email
                    </div>

                    <p className="mt-2 break-all text-sm text-[#51423D]">
                      {selectedContact.email}
                    </p>
                  </a>
                )}

                {selectedContact.phone && (
                  <a
                    href={`tel:${selectedContact.phone}`}
                    className="rounded-xl border border-[#E9DDD7] bg-white p-4 transition hover:bg-[#FAF4F1]"
                  >
                    <div className="flex items-center gap-2 text-xs text-[#A18E86]">
                      <Phone size={14} />
                      Phone
                    </div>

                    <p className="mt-2 text-sm text-[#51423D]">
                      {selectedContact.phone}
                    </p>
                  </a>
                )}
              </div>

              {selectedContact.subject && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#A18E86]">
                    Subject
                  </p>

                  <p className="mt-2 text-base font-medium text-[#4A3934]">
                    {selectedContact.subject}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs uppercase tracking-wider text-[#A18E86]">
                  Message
                </p>

                <div className="mt-2 rounded-2xl border border-[#E9DDD7] bg-white p-5">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-[#66554F]">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-[#A18E86]">
                  Received
                </p>

                <p className="mt-1 text-sm text-[#66554F]">
                  {formatDate(selectedContact.created_at)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-[#EEE3DE] pt-5">
                {selectedContact.email && (
                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: ${
                      selectedContact.subject || "Your inquiry"
                    }`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#4A3934] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#352823]"
                  >
                    <MessageCircle size={17} />
                    Reply by Email
                  </a>
                )}

                {selectedContact.status !== "replied" && (
                  <button
                    onClick={() =>
                      updateStatus(
                        selectedContact.id,
                        "replied"
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E2D4CF] px-4 py-3 text-sm font-medium text-[#6E5148] hover:bg-[#F8F0ED]"
                  >
                    <Check size={17} />
                    Mark Replied
                  </button>
                )}

                <button
                  onClick={() => setSelectedContact(null)}
                  className="ml-auto rounded-xl px-4 py-3 text-sm text-[#806F68] hover:bg-[#F8F0ED]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: ContactSubmission["status"];
}) {
  const styles = {
    new: "bg-[#F4E2DD] text-[#8A574B]",
    read: "bg-[#F2EEE9] text-[#776A63]",
    replied: "bg-[#E8F2EA] text-[#52745B]",
    archived: "bg-[#EEEEEE] text-[#777777]",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}