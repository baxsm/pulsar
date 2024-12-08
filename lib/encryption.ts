import "server-only";

import crypto from "crypto";

export const hash = (data: string) => {
  return crypto.createHash("sha256").update(data).digest("hex");
};
