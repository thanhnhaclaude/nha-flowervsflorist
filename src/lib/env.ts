/**
 * Reads an environment variable, treating empty values and unfilled placeholders such as
 * "<sk_live_...>" (copied from deploy/hostinger-env.txt) as not set.
 */
export function env(name: string) {
  const v = process.env[name]?.trim().replace(/^(['"])(.*)\1$/, "$2");
  if (!v || /^<.*>$/.test(v)) return undefined;
  return v;
}
