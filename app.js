/**
 * cPanel / Phusion Passenger startup file.
 * cPanel looks for app.js by default. The production server is built into dist/
 * with `pnpm build`, then this module starts that server.
 */
import "./dist/index.js";
