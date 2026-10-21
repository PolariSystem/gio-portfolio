export const CONTACT_EMAIL = "imgiovanycruz@gmail.com";
export const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;

export function openEmail(subject?: string, body?: string) {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString().replace(/\+/g, "%20");
  window.location.assign(`${CONTACT_EMAIL_HREF}${query ? `?${query}` : ""}`);
}
