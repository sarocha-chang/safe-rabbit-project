const DEMO_GUIDE_KEY = "demo-guide-seen";

export function hasSeenDemoGuide() {
  try {
    return sessionStorage.getItem(DEMO_GUIDE_KEY) === "true";
  } catch {
    return false;
  }
}

export function markDemoGuideSeen() {
  try {
    sessionStorage.setItem(DEMO_GUIDE_KEY, "true");
  } catch {}
}

export function clearDemoGuideSeen() {
  try {
    sessionStorage.removeItem(DEMO_GUIDE_KEY);
  } catch {}
}
