import fs from "fs";
import path from "path";

export function saveAuditRecord(id: string, data: any) {
  const dir = path.join(process.cwd(), "storage", "audits");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify(data, null, 2));
}
