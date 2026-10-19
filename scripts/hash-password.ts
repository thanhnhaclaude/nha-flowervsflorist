/**
 * Creates ADMIN_PASSWORD_HASH for the admin login:  npm run hash-password -- "your-password"
 * The bcrypt hash is printed base64-encoded because "$" characters break .env files.
 */
import bcrypt from "bcryptjs";

const pw = process.argv[2];
if (!pw || pw.length < 10) {
  console.error('Usage: npm run hash-password -- "a-password-of-10+-characters"');
  process.exit(1);
}
console.log(`ADMIN_PASSWORD_HASH=${Buffer.from(bcrypt.hashSync(pw, 12)).toString("base64")}`);
