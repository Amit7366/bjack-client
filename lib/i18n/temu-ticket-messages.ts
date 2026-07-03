import type { Locale } from "@/lib/locale";

export type TemuTicketHistoryMessages = {
  pageTitle: string;
  totalClaimedAmount: string;
  date: string;
  ticketName: string;
  condition: string;
  addedAmount: string;
  emptyHistory: string;
  loadError: string;
};

const en: TemuTicketHistoryMessages = {
  pageTitle: "TEMU Ticket History",
  totalClaimedAmount: "Total Claimed Amount",
  date: "Date",
  ticketName: "Ticket Name",
  condition: "Condition",
  addedAmount: "Added Amount",
  emptyHistory: "No ticket history yet.",
  loadError: "Could not load ticket history.",
};

const bn: TemuTicketHistoryMessages = {
  pageTitle: "TEMU টিকিট ইতিহাস",
  totalClaimedAmount: "মোট দাবিকৃত পরিমাণ",
  date: "তারিখ",
  ticketName: "টিকিটের নাম",
  condition: "শর্ত",
  addedAmount: "যোগ করা পরিমাণ",
  emptyHistory: "এখনও কোনো টিকিট ইতিহাস নেই।",
  loadError: "টিকিট ইতিহাস লোড করা যায়নি।",
};

const hi: TemuTicketHistoryMessages = {
  pageTitle: "TEMU टिकट इतिहास",
  totalClaimedAmount: "कुल दावा की गई राशि",
  date: "तारीख",
  ticketName: "टिकट का नाम",
  condition: "शर्त",
  addedAmount: "जोड़ी गई राशि",
  emptyHistory: "अभी तक कोई टिकट इतिहास नहीं।",
  loadError: "टिकट इतिहास लोड नहीं हो सका।",
};

const byLocale: Record<Locale, TemuTicketHistoryMessages> = { en, bn, hi };

export function getTemuTicketHistoryMessages(locale: Locale): TemuTicketHistoryMessages {
  return byLocale[locale] ?? en;
}
