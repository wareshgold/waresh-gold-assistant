"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "waresh-gold-install-prompt-dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(DISMISS_KEY) === "1") return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const handleInstalled = () => {
      setInstallEvent(null);
      setVisible(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (!visible || !installEvent) return null;

  const install = async () => {
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setInstallEvent(null);
    setVisible(false);

    if (choice.outcome === "dismissed") {
      window.localStorage.setItem(DISMISS_KEY, "1");
    }
  };

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
    setInstallEvent(null);
  };

  return (
    <div className="waresh-install-prompt" role="dialog" aria-label="نصب وارش گلد">
      <div className="waresh-install-prompt__copy">
        <strong>وارش گلد را روی گوشی داشته باش</strong>
        <span>برای دسترسی سریع‌تر، سایت را به صفحه اصلی اضافه کن.</span>
      </div>
      <div className="waresh-install-prompt__actions">
        <button type="button" onClick={install} className="waresh-install-prompt__install">
          نصب
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="waresh-install-prompt__dismiss"
          aria-label="بستن"
        >
          ×
        </button>
      </div>
    </div>
  );
}
