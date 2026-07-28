"use client";

/**
 * Mock 인증 훅.
 * 실제 Auth 도입 전까지 localStorage 로 세션 흉내.
 * ?role=creator 쿼리로 여성 로그인 시뮬레이션 가능.
 */

import { useEffect, useState } from "react";

const STORAGE_KEY = "cider:auth:v1";

export interface MockUser {
  role: "user" | "creator";
  nickname: string;
  level: number;
  stage: "rookie" | "growing" | "challenger" | "grad_plus";
}

const DEFAULT_USER: MockUser = {
  role: "user",
  nickname: "고구마 오빠",
  level: 2,
  stage: "growing",
};

const DEFAULT_CREATOR: MockUser = {
  role: "creator",
  nickname: "서연",
  level: 12,
  stage: "growing",
};

function readStored(): MockUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MockUser;
  } catch {
    return null;
  }
}

function writeStored(u: MockUser | null) {
  if (typeof window === "undefined") return;
  if (!u) window.localStorage.removeItem(STORAGE_KEY);
  else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  // 같은 탭에서도 다른 컴포넌트가 반응하도록 커스텀 이벤트
  window.dispatchEvent(new Event("cider:auth-change"));
}

export function useAuth() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(readStored());
    setReady(true);
    const onChange = () => setUser(readStored());
    window.addEventListener("cider:auth-change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("cider:auth-change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const login = (role: "user" | "creator" = "user") => {
    const next = role === "creator" ? DEFAULT_CREATOR : DEFAULT_USER;
    writeStored(next);
    setUser(next);
  };
  const logout = () => {
    writeStored(null);
    setUser(null);
  };
  const switchRole = () => {
    if (!user) return;
    login(user.role === "creator" ? "user" : "creator");
  };

  return { user, ready, login, logout, switchRole } as const;
}

export const AUTH_DEFAULTS = { DEFAULT_USER, DEFAULT_CREATOR };
