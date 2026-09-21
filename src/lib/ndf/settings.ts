import "server-only";
import { prisma } from "@/lib/ndf/db";
import { DEFAULT_NAME_TEMPLATE } from "@/lib/ndf/naming";

export type DeliveryMode = "zip" | "pdf";

export type DeliveryConfig = {
  /** zip : archive avec fichiers séparés ; pdf : un seul PDF (NDF + pièces jointes). */
  mode: DeliveryMode;
  nameTemplate: string;
};

const KEY_MODE = "delivery_mode";
const KEY_TEMPLATE = "pdf_name_template";

export async function getDeliveryConfig(): Promise<DeliveryConfig> {
  try {
    const rows = await prisma.setting.findMany({ where: { key: { in: [KEY_MODE, KEY_TEMPLATE] } } });
    const map = new Map(rows.map((r) => [r.key, r.value]));
    return {
      mode: map.get(KEY_MODE) === "pdf" ? "pdf" : "zip",
      nameTemplate: map.get(KEY_TEMPLATE)?.trim() || DEFAULT_NAME_TEMPLATE,
    };
  } catch (err) {
    console.error("getDeliveryConfig:", err);
    return { mode: "zip", nameTemplate: DEFAULT_NAME_TEMPLATE };
  }
}

export async function saveDeliveryConfig(config: DeliveryConfig): Promise<void> {
  const entries: [string, string][] = [
    [KEY_MODE, config.mode],
    [KEY_TEMPLATE, config.nameTemplate],
  ];
  for (const [key, value] of entries) {
    await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
}
