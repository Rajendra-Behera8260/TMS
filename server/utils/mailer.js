const https = require("https");

const BREVO_API_HOST = "api.brevo.com";
const BREVO_API_PATH = "/v3/smtp/email";

const getSenderEmail = () =>
  process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER || "";

const getSenderName = () =>
  process.env.BREVO_SENDER_NAME || "TMS";

const isMailConfigured = () =>
  Boolean(process.env.BREVO_API_KEY && getSenderEmail());

const sendBrevoRequest = (payload) =>
  new Promise((resolve, reject) => {
    const request = https.request(
      {
        hostname: BREVO_API_HOST,
        path: BREVO_API_PATH,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
          "api-key": process.env.BREVO_API_KEY,
        },
        timeout: 15000,
      },
      (response) => {
        let responseBody = "";

        response.on("data", (chunk) => {
          responseBody += chunk;
        });

        response.on("end", () => {
          let parsedBody = {};

          if (responseBody) {
            try {
              parsedBody = JSON.parse(responseBody);
            } catch (parseError) {
              parsedBody = { message: responseBody };
            }
          }

          if (response.statusCode >= 200 && response.statusCode < 300) {
            resolve(parsedBody);
            return;
          }

          const error = new Error(
            parsedBody.message ||
              parsedBody.code ||
              `Brevo request failed with status ${response.statusCode}`
          );

          error.statusCode = response.statusCode;
          error.responseBody = parsedBody;
          reject(error);
        });
      }
    );

    request.on("timeout", () => {
      request.destroy(new Error("Brevo request timed out."));
    });

    request.on("error", (error) => {
      reject(error);
    });

    request.write(payload);
    request.end();
  });

const createMailTransporter = () => {
  if (!isMailConfigured()) {
    return null;
  }

  return {
    async sendMail({ to, subject, html, text, from }) {
      const senderEmail = from || getSenderEmail();
      const payload = JSON.stringify({
        sender: {
          email: senderEmail,
          name: getSenderName(),
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text,
      });

      return sendBrevoRequest(payload);
    },
  };
};

const formatMailError = (error) => {
  if (!error) {
    return "Unknown email error";
  }

  if (error.code === "ENOTFOUND") {
    return 'Unable to reach Brevo API. Check internet access and DNS for "api.brevo.com".';
  }

  if (error.statusCode === 401 || error.statusCode === 403) {
    return "Brevo authentication failed. Check BREVO_API_KEY.";
  }

  if (error.statusCode === 400) {
    return `Brevo rejected the email payload: ${error.message}`;
  }

  return error.message || "Unknown email error";
};

module.exports = {
  createMailTransporter,
  formatMailError,
  isMailConfigured,
};
