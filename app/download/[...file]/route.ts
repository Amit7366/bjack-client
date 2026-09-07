import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { banglajackpot_ANDROID_APK_FILENAME } from "@/lib/seo/site-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const APK_MIME = "application/vnd.android.package-archive";
const APK_SEGMENTS = ["banglajackpot", banglajackpot_ANDROID_APK_FILENAME] as const;

function apkFilePath(): string {
  return path.join(process.cwd(), "public", "download", ...APK_SEGMENTS);
}

function attachmentHeaders(extra?: Record<string, string>): Headers {
  return new Headers({
    "Content-Type": APK_MIME,
    "Content-Disposition": `attachment; filename="${banglajackpot_ANDROID_APK_FILENAME}"`,
    "X-Content-Type-Options": "nosniff",
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=3600, immutable",
    ...extra,
  });
}

function parseByteRange(
  rangeHeader: string | null,
  size: number,
): { start: number; end: number } | "invalid" | null {
  if (!rangeHeader) return null;
  const match = /^bytes=(\d*)-(\d*)$/i.exec(rangeHeader.trim());
  if (!match) return "invalid";

  const startRaw = match[1];
  const endRaw = match[2];

  if (!startRaw && !endRaw) return "invalid";

  let start: number;
  let end: number;

  if (!startRaw) {
    const suffix = Number(endRaw);
    if (!Number.isFinite(suffix) || suffix <= 0) return "invalid";
    start = Math.max(size - suffix, 0);
    end = size - 1;
  } else {
    start = Number(startRaw);
    end = endRaw ? Number(endRaw) : size - 1;
  }

  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end >= size || start > end) {
    return "invalid";
  }

  return { start, end };
}

function isOfficialApk(file: string[]): boolean {
  return file.length === APK_SEGMENTS.length && APK_SEGMENTS.every((segment, i) => file[i] === segment);
}

function resolveApk(): { filePath: string; size: number } | NextResponse {
  const filePath = apkFilePath();
  if (!existsSync(filePath)) {
    return new NextResponse("APK not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return { filePath, size: statSync(filePath).size };
}

export async function HEAD(
  _request: Request,
  context: { params: Promise<{ file: string[] }> },
) {
  const { file } = await context.params;
  if (!isOfficialApk(file)) {
    return new NextResponse(null, { status: 404 });
  }

  const resolved = resolveApk();
  if (resolved instanceof NextResponse) return resolved;

  return new NextResponse(null, {
    status: 200,
    headers: attachmentHeaders({ "Content-Length": String(resolved.size) }),
  });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ file: string[] }> },
) {
  const { file } = await context.params;
  if (!isOfficialApk(file)) {
    return new NextResponse("Not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const resolved = resolveApk();
  if (resolved instanceof NextResponse) return resolved;

  const { filePath, size } = resolved;
  const range = parseByteRange(request.headers.get("range"), size);

  if (range === "invalid") {
    return new NextResponse(null, {
      status: 416,
      headers: {
        "Content-Range": `bytes */${size}`,
        "Accept-Ranges": "bytes",
      },
    });
  }

  const start = range?.start ?? 0;
  const end = range?.end ?? size - 1;
  const nodeStream = createReadStream(filePath, { start, end });
  const body = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;

  if (range) {
    return new NextResponse(body, {
      status: 206,
      headers: attachmentHeaders({
        "Content-Length": String(end - start + 1),
        "Content-Range": `bytes ${start}-${end}/${size}`,
      }),
    });
  }

  return new NextResponse(body, {
    status: 200,
    headers: attachmentHeaders({ "Content-Length": String(size) }),
  });
}
