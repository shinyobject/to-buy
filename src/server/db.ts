import { Database } from "bun:sqlite";
import type { CreateWishItemInput, WishItem } from "../shared/types";

const dataDir = `${process.cwd()}/data`;

await Bun.$`mkdir -p ${dataDir}`;

const db = new Database(`${dataDir}/to-buy.sqlite`, { create: true });

db.exec(`
  CREATE TABLE IF NOT EXISTS wish_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const selectAllStatement = db.query(`
  SELECT
    id,
    title,
    url,
    notes,
    created_at AS createdAt
  FROM wish_items
  ORDER BY datetime(created_at) DESC, id DESC
`);

const insertStatement = db.query(`
  INSERT INTO wish_items (title, url, notes)
  VALUES ($title, $url, $notes)
  RETURNING
    id,
    title,
    url,
    notes,
    created_at AS createdAt
`);

export const listWishItems = (): WishItem[] => {
  return selectAllStatement.all() as WishItem[];
};

export const createWishItem = (input: CreateWishItemInput): WishItem => {
  return insertStatement.get({
    $title: input.title.trim(),
    $url: input.url.trim(),
    $notes: input.notes?.trim() || null
  }) as WishItem;
};
