const jwt = require("jsonwebtoken");

const ADMIN_COOKIE_NAME = "tms_admin_token";

const getAdminCredentials = () => {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = (process.env.ADMIN_PASSWORD || "").trim();

  return { email, password, isConfigured: Boolean(email && password) };
};

const parseCookies = (cookieHeader = "") =>
  cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .reduce((accumulator, cookie) => {
      const separatorIndex = cookie.indexOf("=");
      if (separatorIndex === -1) {
        return accumulator;
      }

      const key = cookie.slice(0, separatorIndex);
      const value = cookie.slice(separatorIndex + 1);
      accumulator[key] = decodeURIComponent(value);
      return accumulator;
    }, {});

const createAdminToken = (email) =>
  jwt.sign({ type: "admin", email }, process.env.JWT_SECRET, { expiresIn: "1d" });

const getAdminFromRequest = (req) => {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies[ADMIN_COOKIE_NAME];

    if (!token) {
      return null;
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.type !== "admin") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};

const setAdminCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.setHeader(
    "Set-Cookie",
    `${ADMIN_COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax${isProduction ? "; Secure" : ""}`
  );
};

const clearAdminCookie = (res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.setHeader(
    "Set-Cookie",
    `${ADMIN_COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${isProduction ? "; Secure" : ""}`
  );
};

const requireAdminAuth = (req, res, next) => {
  const admin = getAdminFromRequest(req);

  if (!admin) {
    return res.redirect("/admin/login");
  }

  req.admin = admin;
  return next();
};

const redirectIfAdminAuth = (req, res, next) => {
  const admin = getAdminFromRequest(req);

  if (admin) {
    return res.redirect("/admin/dashboard");
  }

  return next();
};

module.exports = {
  ADMIN_COOKIE_NAME,
  clearAdminCookie,
  createAdminToken,
  getAdminCredentials,
  getAdminFromRequest,
  redirectIfAdminAuth,
  requireAdminAuth,
  setAdminCookie,
};
