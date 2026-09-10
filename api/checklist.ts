import fs from "node:fs";
import path from "node:path";

// Serves the lead magnet. It lives outside the public directory and is sent
// with a noindex header so the PDF itself cannot outrank the landing page and
// let readers skip the email step.

interface ApiRequest {
  method?: string;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
  end: (chunk?: Buffer) => void;
}

const FILE = "money-pattern-checklist.pdf";

export default function handler(req: ApiRequest, res: ApiResponse): void {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const filePath = path.join(process.cwd(), "assets", "lead-magnets", FILE);
  if (!fs.existsSync(filePath)) {
    console.error("Lead magnet missing on disk:", FILE);
    res.status(500).json({ error: "That download is temporarily unavailable." });
    return;
  }

  const contents = fs.readFileSync(filePath);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${FILE}"`);
  res.setHeader("Content-Length", String(contents.length));
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.end(contents);
}
