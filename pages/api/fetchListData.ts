import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { Item } from "../../types";

const GOOGLE_DRIVE_URL =
  "https://drive.google.com/uc?export=download&id=1U_vGR_Uwz18ciibqowO32U-0X3a1kL9_";

const LOCAL_CSV_PATH = path.join(process.cwd(), "data", "items.csv");

async function downloadCSV() {
  const response = await fetch(GOOGLE_DRIVE_URL);
  const csvData = await response.text();
  fs.writeFileSync(LOCAL_CSV_PATH, csvData, "utf8");

  console.log("CSV file downloaded and saved.");
}

function readLocalCSV(): Item[] {
  const csvData = fs.readFileSync(LOCAL_CSV_PATH, "utf8");

  console.log("Raw CSV data:", csvData.slice(0, 200) + "...");

  const lines = csvData.split("\n").filter((line) => line.trim() !== "");

  const items: Item[] = lines
    .map((line) => {
      const [dateTime, filename] = line.split(";");

      if (!dateTime || !filename) {
        console.warn(`Skipping invalid line: ${line}`);
        return null;
      }

      return {
        createdAt: dateTime.trim(),
        filename: filename.trim(),
      };
    })
    .filter((item): item is Item => item !== null);

  console.log("Parsed items:", items.slice(0, 2));

  return items;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!fs.existsSync(LOCAL_CSV_PATH)) {
      await downloadCSV();
    }

    const items = readLocalCSV();

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching or parsing CSV:", error);
    res.status(500).json({ error: "Failed to fetch or parse CSV data" });
  }
}
