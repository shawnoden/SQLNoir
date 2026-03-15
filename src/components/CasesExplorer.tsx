"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { Dashboard } from "./Dashboard";
import { PaywallModal } from "./PaywallModal";
import { AuthModal } from "./auth/AuthModal";
import { supabase } from "@/lib/supabase";
import { getCaseSlug } from "@/lib/case-utils";
import { getUserHasLicense } from "@/lib/license";
import type { Case } from "@/types";

interface CasesExplorerProps {
  initialSession?: Session | null;
  initialUserInfo?: any;
}

export function CasesExplorer({
  initialSession = null,
  initialUserInfo = null,
}: CasesExplorerProps) {
  const [user, setUser] = useState<any>(initialSession?.user ?? null);
  const [userInfo, setUserInfo] = useState<any>(initialUserInfo);
  const [paywallCase, setPaywallCase] = useState<Case | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  const hasLicense = getUserHasLicense(userInfo);

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
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          if (!initialUserInfo) fetchUserInfo(session.user.id);
        } else {
          setUser(null);
          setUserInfo(null);
        }
      })
      .catch((error) => {
        console.error("Error checking session:", error);
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
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserInfo, initialUserInfo]);

  const handleCaseSelect = (caseData: Case) => {
    router.push(`/cases/${getCaseSlug(caseData)}`);
  };

  const handleLockedCaseClick = (caseData: Case) => {
    if (!user) {
      // Not signed in — prompt auth first
      setShowAuthModal(true);
      return;
    }
    // Signed in but no license — show paywall
    setPaywallCase(caseData);
  };

  return (
    <>
      <Dashboard
        onCaseSelect={handleCaseSelect}
        onLockedCaseClick={handleLockedCaseClick}
        userInfo={userInfo}
        hasLicense={hasLicense}
      />
      <PaywallModal
        isOpen={paywallCase !== null}
        onClose={() => setPaywallCase(null)}
        caseId={paywallCase?.id ?? ""}
        triggerLocation="case_selection"
        isSignedIn={!!user}
        onSignInRequired={() => {
          setPaywallCase(null);
          setShowAuthModal(true);
        }}
      />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
