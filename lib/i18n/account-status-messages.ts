import type { Locale } from "@/lib/locale";
import type { AccountStatus } from "@/lib/account-status";

export function getAccountRestrictionMessage(
  locale: Locale,
  status?: string | null,
): string {
  const messages: Record<Locale, Record<Exclude<AccountStatus, "active">, string>> = {
    en: {
      frozen: "Your account is temporarily frozen. You cannot play games or withdraw.",
      deactivated: "Your account is deactivated. This action is not allowed.",
      pending: "Your account is under review. You cannot play games or withdraw yet.",
    },
    bn: {
      frozen: "আপনার অ্যাকাউন্ট সাময়িকভাবে ফ্রোজেন। আপনি গেম খেলতে বা উত্তোলন করতে পারবেন না।",
      deactivated: "আপনার অ্যাকাউন্ট নিষ্ক্রিয়। এই কাজটি অনুমোদিত নয়।",
      pending: "আপনার অ্যাকাউন্ট পর্যালোচনাধীন। এখনই গেম খেলা বা উত্তোলন করা যাবে না।",
    },
    hi: {
      frozen: "आपका खाता अस्थायी रूप से फ्रोज़न है। आप गेम नहीं खेल सकते या निकासी नहीं कर सकते।",
      deactivated: "आपका खाता निष्क्रिय है। यह कार्रवाई अनुमत नहीं है।",
      pending: "आपका खाता समीक्षाधीन है। अभी गेम या निकासी की अनुमति नहीं है।",
    },
  };

  if (!status || status === "active") {
    return locale === "bn"
      ? "এই কাজটি আপনার অ্যাকাউন্টের জন্য অনুমোদিত নয়।"
      : locale === "hi"
        ? "यह कार्रवाई आपके खाते के लिए अनुमत नहीं है।"
        : "This action is not allowed for your account.";
  }

  if (status === "frozen" || status === "deactivated" || status === "pending") {
    return messages[locale][status];
  }

  return messages[locale].pending;
}
