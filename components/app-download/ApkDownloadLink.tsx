import type { AnchorHTMLAttributes } from "react";
import { rajabaji_ANDROID_APK_FILENAME, rajabaji_ANDROID_APP_PATH } from "@/lib/seo/site-config";

type ApkDownloadLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "download">;

/**
 * Native `<a download>` (not Next.js `<Link>`).
 * The filename must be non-empty so the App Router does not intercept the click
 * and serve the HTML app shell — which is what mobile browsers were saving.
 */
export default function ApkDownloadLink({ children, ...props }: ApkDownloadLinkProps) {
  return (
    <a
      {...props}
      href={rajabaji_ANDROID_APP_PATH}
      download={rajabaji_ANDROID_APK_FILENAME}
      type="application/vnd.android.package-archive"
    >
      {children}
    </a>
  );
}
