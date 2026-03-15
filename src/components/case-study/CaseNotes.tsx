"use client";

import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { useTranslations } from "next-intl";

interface CaseNotesProps {
  caseId: string;
}

export function CaseNotes({ caseId }: CaseNotesProps) {
  const t = useTranslations();
  const [notes, setNotes] = useState("");

  // Load saved notes from localStorage when component mounts
  useEffect(() => {
    const savedNotes = localStorage.getItem(`case-notes-${caseId}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [caseId]);

  // Save notes to localStorage
  const handleSave = (noteText: string) => {
    localStorage.setItem(`case-notes-${caseId}`, noteText);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    handleSave(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-detective text-xl text-amber-900">
          {t('notes.title')}
        </h3>
      </div>

      <div className="bg-white rounded-lg border border-amber-200 shadow-inner">
        <textarea
          value={notes}
          onChange={handleChange}
          placeholder={t('notes.placeholder')}
          className="w-full h-[calc(100vh-400px)] min-h-[300px] p-4 rounded-lg bg-transparent font-mono text-amber-900 
                   focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          style={{
            lineHeight: "30px",
          }}
        />
      </div>

      <div className="text-sm text-amber-700/70 italic">
        {t('notes.autoSaveMessage')}
      </div>
    </div>
  );
}
