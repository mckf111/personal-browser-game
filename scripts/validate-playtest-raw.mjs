#!/usr/bin/env node
/**
 * validate-playtest-raw.mjs
 *
 * Validates raw external playtest evidence against the rescue plan schema.
 * Usage: node scripts/validate-playtest-raw.mjs <directory>
 *
 * Exit codes:
 *   0 = schema compliance passes (>=3 files, all labels, >=1 mobile)
 *   1 = validation fails (insufficient files, missing labels, or no mobile)
 */

import { readdirSync, readFileSync, statSync } from "fs";
import { join, basename } from "path";

const TARGET_DIR = process.argv[2];

if (!TARGET_DIR) {
  console.error("Usage: node scripts/validate-playtest-raw.mjs <directory>");
  process.exit(1);
}

let files;
try {
  const entries = readdirSync(TARGET_DIR);
  files = entries
    .map((f) => join(TARGET_DIR, f))
    .filter((p) => {
      try {
        return statSync(p).isFile() && p.endsWith(".md");
      } catch {
        return false;
      }
    });
} catch (err) {
  console.error(`Cannot read directory: ${TARGET_DIR}`);
  console.error(err.message);
  process.exit(1);
}

// Exclude template/readme/index files
const excludedNames = ["template", "readme", "index", "example"];
const rawFiles = files.filter((p) => {
  const name = basename(p, ".md").toLowerCase();
  return !excludedNames.some((ex) => name.includes(ex));
});

console.log(`Directory: ${TARGET_DIR}`);
console.log(`Total markdown files: ${files.length}`);
console.log(`Excluding templates/readmes: ${rawFiles.length}`);
console.log("");

// Schema labels (supporting Chinese and English)
const requiredLabels = [
  { en: /player\s*code|代号|玩家代号/i, zh: "玩家代号", enLabel: "player code" },
  { en: /date|日期/i, zh: "日期", enLabel: "date" },
  { en: /device|设备/i, zh: "设备", enLabel: "device" },
  { en: /browser|浏览器/i, zh: "浏览器", enLabel: "browser" },
  { en: /role|角色/i, zh: "角色", enLabel: "role played" },
  { en: /duration|时长|时间|试玩时长/i, zh: "时长", enLabel: "duration" },
  { en: /stuck|卡点|困惑|不舒服|困难/i, zh: "卡点", enLabel: "stuck point" },
  { en: /satisfying|爽点|满足|开心/i, zh: "爽点", enLabel: "satisfying moment" },
  { en: /would\s*play\s*again|再来|再玩|想再来/i, zh: "再来", enLabel: "would play again" },
  { en: /quote|原话|摘录|quote/i, zh: "原话", enLabel: "quote" },
];

const mobileIndicators = /mobile|iphone|android|ios|ipad|ipod|safari.*mobile|chrome.*mobile|三星|xiaomi|huawei|oppo|vivo|一加/i;

let mobileCount = 0;
const fileResults = [];

for (const filePath of rawFiles) {
  const content = readFileSync(filePath, "utf-8");
  const missing = [];
  let hasMobile = false;

  for (const label of requiredLabels) {
    if (!label.en.test(content)) {
      missing.push(label.zh);
    }
  }

  // Check for mobile indicator in device/browser lines
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    if (mobileIndicators.test(line)) {
      hasMobile = true;
      break;
    }
  }

  if (hasMobile) mobileCount++;

  fileResults.push({
    file: basename(filePath),
    valid: missing.length === 0,
    missing,
    hasMobile,
  });
}

let allValid = true;
for (const r of fileResults) {
  const status = r.valid ? "OK" : "FAIL";
  const mobileStatus = r.hasMobile ? "[mobile]" : "";
  console.log(`[${status}] ${r.file} ${mobileStatus}`);
  if (!r.valid) {
    console.log(`       Missing labels: ${r.missing.join(", ")}`);
    allValid = false;
  }
}

console.log("");
console.log("=== Summary ===");
console.log(`Valid raw files (excluding template): ${rawFiles.length}`);
console.log(`Files passing all schema labels:     ${fileResults.filter((r) => r.valid).length}`);
console.log(`Files with mobile indicator:          ${mobileCount}`);
console.log("");

const passCount = rawFiles.length;
const schemaPass = allValid && passCount >= 3;
const mobilePass = mobileCount >= 1;

if (schemaPass && mobilePass) {
  console.log("RESULT: PASS — schema compliance confirmed.");
  process.exit(0);
} else {
  console.log("RESULT: FAIL — quality approval is blocked.");
  if (passCount < 3) {
    console.log(`  Reason: need at least 3 raw files, found ${passCount}.`);
  }
  if (!allValid) {
    console.log("  Reason: one or more files missing required schema labels.");
  }
  if (!mobilePass) {
    console.log("  Reason: no file indicates a mobile device/browser.");
  }
  process.exit(1);
}
