// Where the Express backend runs. Used by the /api rewrite and by server-side fetches.
export const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";
