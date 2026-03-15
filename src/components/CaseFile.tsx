"use client";

import { Case } from "../types";
import { useTranslations } from "next-intl";

interface CaseFileProps {
  caseData: Case;
  onClick: () => void;
  isSolved?: boolean;
}

export function CaseFile({ caseData, onClick, isSolved }: CaseFileProps) {
  const t = useTranslations();
  return (
    <div
      onClick={onClick}
      className="group relative paper-texture p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-amber-900/20 hover:scale-102"
    >
      {caseData.isNew && !isSolved && (
        <div className="absolute top-0 -right-2 z-20">
          <div className="relative">
            <div
              className="bg-red-800 text-amber-50 px-4 py-1 rounded-sm font-detective 
                       border-2 border-double border-red-900 shadow-lg
                       flex items-center justify-center transform rotate-12"
              style={{
                textShadow: "1px 1px 0 rgba(0,0,0,0.3)",
                boxShadow:
                  "2px 2px 4px rgba(0,0,0,0.2), -1px -1px 2px rgba(255,255,255,0.1) inset",
              }}
            >
              <span className="text-sm tracking-wider">{t('common.new')}</span>
            </div>
          </div>
        </div>
      )}
      {isSolved && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div
            className="bg-red-800/90 text-amber-50 px-8 py-4 rounded-sm font-detective 
                     border-4 border-double border-red-900 shadow-lg transform -rotate-12 
                     flex flex-col items-center backdrop-blur-sm"
            style={{
              textShadow: "2px 2px 0 rgba(0,0,0,0.2)",
              boxShadow:
                "4px 4px 8px rgba(0,0,0,0.2), -2px -2px 4px rgba(255,255,255,0.1) inset",
            }}
          >
            <div className="text-2xl tracking-[0.2em] font-bold">{t('common.solved')}</div>
          </div>
        </div>
      )}
      <h3 className="font-detective text-xl mb-2 text-amber-900">
        {caseData.title}
      </h3>
      <p className="text-amber-800/80 text-sm mb-4">{caseData.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono bg-amber-100/80 backdrop-blur-sm px-2 py-1 rounded">
          {t('common.xpLabel', { amount: caseData.xpReward })}
        </span>
      </div>
    </div>
  );
}
