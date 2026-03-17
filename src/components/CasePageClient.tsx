"use client";

import { useRouter } from "@/i18n/navigation";
import { useCallback, useEffect, useState } from "react";
import { CaseSolver } from "./CaseSolver";
import { PaywallModal } from "./PaywallModal";
import { AuthModal } from "./auth/AuthModal";
import { supabase } from "@/lib/supabase";
import { isCaseFree, getUserHasLicense } from "@/lib/license";
import { track } from "@vercel/analytics/react";
import { trackCaseStarted } from "@/lib/posthog-events";
import { useTranslations } from "next-intl";
import type { Case } from "@/types";

interface CasePageClientProps {
  caseData: Case;
}

export function CasePageClient({ caseData }: CasePageClientProps) {
  const router = useRouter();
  const t = useTranslations("license");
  const [user, setUser] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(!isCaseFree(caseData));
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [caseStartTime] = useState(() => Date.now());

  const hasLicense = getUserHasLicense(userInfo);
  const needsLicense = !isCaseFree(caseData);

  const fetchUserInfo = useCallback(async (userId: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("user_info")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setUserInfo(data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    track("case_view", {
      case_slug: caseData.id,
      title: caseData.title,
      difficulty: caseData.difficulty,
      category: caseData.category,
      xp_reward: caseData.xpReward,
    });
    trackCaseStarted({
      case_id: caseData.id,
      case_name: caseData.title,
      difficulty: caseData.difficulty,
    });
  }, [caseData]);

  useEffect(() => {
    if (!needsLicense) {
      setLoading(false);
      return;
    }
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          fetchUserInfo(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchUserInfo(currentUser.id);
      } else {
        setUserInfo(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [needsLicense, fetchUserInfo]);

  // Show loading while checking license for locked cases
  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-300 border-t-amber-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-detective text-amber-800">
            {t('checkingCredentials')}
          </p>
        </div>
      </div>
    );
  }

  // If case requires license and user doesn't have one, show blocked state
  if (needsLicense && !hasLicense) {
    return (
      <div className="min-h-screen bg-amber-50/50 flex items-center justify-center px-4">
        <div className="paper-texture p-8 rounded-xl shadow-xl border border-amber-900/20 max-w-md text-center">
          <h2 className="font-detective text-2xl text-amber-900 mb-3">
            {t('caseClassified')}
          </h2>
          <p className="text-amber-800/80 mb-6 text-sm">
            {t('caseClassifiedDesc')}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowPaywall(true)}
              className="py-3 px-6 rounded-lg font-detective text-amber-50
                       bg-amber-800 hover:bg-amber-700 transition-colors
                       border-2 border-amber-900/50 shadow-lg"
            >
              {t('getLicense')}
            </button>
            <button
              onClick={() => router.push("/cases")}
              className="py-2 text-amber-700/70 hover:text-amber-800 text-sm font-detective transition-colors"
            >
              {t('backToCaseFiles')}
            </button>
          </div>
        </div>
        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          caseId={caseData.id}
          triggerLocation="case_page"
        />
      </div>
    );
  }

  return (
    <CaseSolver
      caseData={caseData}
      onBack={() => router.push("/cases")}
      onSolve={() => router.refresh()}
      caseStartTime={caseStartTime}
    />
  );
}
