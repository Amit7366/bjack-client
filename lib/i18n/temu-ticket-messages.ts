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

export type TemuTicketGameMessages = {
  pageTitle: string;
  historyLink: string;
  targetReward: string;
  progress: string;
  inviteFriends: string;
  inviteHint: string;
  copyLink: string;
  linkCopied: string;
  claimReward: string;
  fillTargetHint: string;
  rewardClaimed: string;
  inviteCount: string;
  expiresIn: string;
  claimSuccess: string;
  claimError: string;
  loadError: string;
  shareText: string;
};

export type TemuTicketMessages = TemuTicketHistoryMessages & TemuTicketGameMessages;

const en: TemuTicketMessages = {
  pageTitle: "TEMU Ticket",
  historyLink: "History",
  targetReward: "Target reward",
  progress: "Progress",
  inviteFriends: "Invite friends",
  inviteHint: "Invite friends to fill the progress bar. You can claim only after reaching 100%.",
  copyLink: "Copy invite link",
  linkCopied: "Invite link copied",
  claimReward: "Claim reward",
  fillTargetHint: "Keep inviting friends until the bar reaches 100%, then claim your reward.",
  rewardClaimed: "Reward claimed successfully",
  inviteCount: "Friends invited",
  expiresIn: "Expires",
  claimSuccess: "Reward claimed successfully",
  claimError: "Could not claim reward",
  loadError: "Could not load TEMU ticket",
  shareText: "Join city777 with my link and help me open the treasure box!",
  totalClaimedAmount: "Total Claimed Amount",
  date: "Date",
  ticketName: "Ticket Name",
  condition: "Condition",
  addedAmount: "Added Amount",
  emptyHistory: "No ticket history yet.",
};

const bn: TemuTicketMessages = {
  pageTitle: "TEMU টিকিট",
  historyLink: "ইতিহাস",
  targetReward: "লক্ষ্য পুরস্কার",
  progress: "অগ্রগতি",
  inviteFriends: "বন্ধুদের আমন্ত্রণ",
  inviteHint: "প্রগতি বার ১০০% পূর্ণ করতে বন্ধুদের আমন্ত্রণ করুন। শুধুমাত্র তখনই পুরস্কার দাবি করতে পারবেন।",
  copyLink: "আমন্ত্রণ লিংক কপি",
  linkCopied: "আমন্ত্রণ লিংক কপি হয়েছে",
  claimReward: "পুরস্কার দাবি করুন",
  fillTargetHint: "বার ১০০% না হওয়া পর্যন্ত বন্ধুদের আমন্ত্রণ করতে থাকুন, তারপর পুরস্কার দাবি করুন।",
  rewardClaimed: "পুরস্কার দাবি সম্পন্ন",
  inviteCount: "আমন্ত্রিত বন্ধু",
  expiresIn: "মেয়াদ শেষ",
  claimSuccess: "পুরস্কার সফলভাবে দাবি হয়েছে",
  claimError: "পুরস্কার দাবি করা যায়নি",
  loadError: "TEMU টিকিট লোড করা যায়নি",
  shareText: "আমার লিংক দিয়ে city777-তে যোগ দিন এবং ট্রেজার বক্স খুলতে সাহায্য করুন!",
  totalClaimedAmount: "মোট দাবিকৃত পরিমাণ",
  date: "তারিখ",
  ticketName: "টিকিটের নাম",
  condition: "শর্ত",
  addedAmount: "যোগ করা পরিমাণ",
  emptyHistory: "এখনও কোনো টিকিট ইতিহাস নেই।",
};

const hi: TemuTicketMessages = {
  pageTitle: "TEMU टिकट",
  historyLink: "इतिहास",
  targetReward: "लक्ष्य इनाम",
  progress: "प्रगति",
  inviteFriends: "मित्रों को आमंत्रित करें",
  inviteHint: "प्रगति 100% भरने के लिए मित्रों को आमंत्रित करें। केवल तब ही इनाम दावा कर सकते हैं।",
  copyLink: "आमंत्रण लिंक कॉपी करें",
  linkCopied: "आमंत्रण लिंक कॉपी हो गया",
  claimReward: "इनाम दावा करें",
  fillTargetHint: "बार 100% होने तक मित्रों को आमंत्रित करते रहें, फिर इनाम दावा करें।",
  rewardClaimed: "इनाम दावा पूरा",
  inviteCount: "आमंत्रित मित्र",
  expiresIn: "समाप्ति",
  claimSuccess: "इनाम सफलतापूर्वक दावा किया गया",
  claimError: "इनाम दावा नहीं हो सका",
  loadError: "TEMU टिकट लोड नहीं हो सका",
  shareText: "मेरे लिंक से city777 में शामिल हों और ट्रेजर बॉक्स खोलने में मदद करें!",
  totalClaimedAmount: "कुल दावा की गई राशि",
  date: "तारीख",
  ticketName: "टिकट का नाम",
  condition: "शर्त",
  addedAmount: "जोड़ी गई राशि",
  emptyHistory: "अभी तक कोई टिकट इतिहास नहीं।",
};

const byLocale: Record<Locale, TemuTicketMessages> = { en, bn, hi };

export function getTemuTicketMessages(locale: Locale): TemuTicketMessages {
  return byLocale[locale] ?? en;
}

export function getTemuTicketHistoryMessages(locale: Locale): TemuTicketHistoryMessages {
  return getTemuTicketMessages(locale);
}
