"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Facebook, Linkedin, Link2, Twitter, X } from "lucide-react";
import { track } from "@vercel/analytics/react";
import { useTranslations } from "next-intl";

interface SharePopupProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
}

export function SharePopup({
  isOpen,
  onClose,
  context = "unknown",
}: SharePopupProps) {
  const t = useTranslations();
  const [copyStatus, setCopyStatus] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const shareUrl = "https://www.sqlnoir.com";
  const shareTitle = "SQL Noir - Learn SQL by solving crimes";

  const shareOptions = [
    {
      id: "twitter",
      name: t('share.twitter'),
      icon: Twitter,
      onClick: () => {
        track("share_option_click", { option: "twitter", context, url: shareUrl });
        window.open(
          `https://x.com/intent/tweet?text=${encodeURIComponent(
            shareTitle
          )}&url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
      },
    },
    {
      id: "facebook",
      name: t('share.facebook'),
      icon: Facebook,
      onClick: () => {
        track("share_option_click", { option: "facebook", context, url: shareUrl });
        window.open(
          `https://www.facebook.com/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`,
          "_blank"
        );
      },
    },
    {
      id: "linkedin",
      name: t('share.linkedin'),
      icon: Linkedin,
      onClick: () => {
        track("share_option_click", { option: "linkedin", context, url: shareUrl });
        window.open(
          `https://www.linkedin.com/feed/?linkOrigin=LI_BADGE&shareActive=true&shareUrl=${encodeURIComponent(
            shareUrl
          )}`,
          "_blank"
        );
      },
    },
    {
      id: "copy_link",
      name: t('share.copyLink'),
      icon: Link2,
      onClick: async () => {
        await navigator.clipboard.writeText(shareUrl);
        track("share_option_click", {
          option: "copy_link",
          context,
          url: shareUrl,
        });
        setCopyStatus(t('share.linkCopied'));
        setTimeout(() => setCopyStatus(""), 2000);
      },
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div
        ref={dropdownRef}
        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] max-w-[90vw] bg-amber-50 border border-amber-200 rounded-xl shadow-2xl p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-detective text-lg text-amber-900">
            {t('share.title')}
          </h3>
          <button
            onClick={onClose}
            className="text-amber-700 hover:text-amber-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {shareOptions.map((option) => (
            <button
              key={option.id}
              onClick={option.onClick}
              className="flex items-center justify-center gap-2 p-3 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors duration-200"
            >
              <option.icon className="w-5 h-5" />
              <span className="font-medium">
                {option.id === "copy_link" && copyStatus
                  ? copyStatus
                  : option.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>,
    document.body
  );
}
