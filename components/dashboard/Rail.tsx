"use client";

import Image from "next/image";
// components/dashboard/Rail.tsx
// Narrow 62px icon nav strip. Pure client because of nav state + click handlers.

import { useEffect, useRef, useState } from "react";
import { tokens } from "../landing/tokens";
import {
  HomeIcon, SearchIcon, CheckBoxIcon, ShareIcon, ArchiveIcon, SettingsIcon, PlusIcon,
} from "./Icons";
import { signOut } from "next-auth/react";

function RailIcon({
  children,
  active,
  badge,
  onClick,
  title,
}: {
  children: React.ReactNode;
  active?: boolean;
  badge?: string;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        position: "relative",
        width: 38,
        height: 38,
        borderRadius: 9,
        background: active
          ? `linear-gradient(135deg, ${tokens.violet}1f, ${tokens.cyan}1f)`
          : "transparent",
        border: `1px solid ${active ? tokens.cyan + "40" : "transparent"}`,
        color: active ? tokens.cyan : tokens.textDim,
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
        transition: "all 0.15s",
        padding: 0,
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      {children}
      {badge && (
        <span
          style={{
            position: "absolute",
            top: -2,
            right: -2,
            minWidth: 16,
            height: 16,
            padding: "0 4px",
            borderRadius: 99,
            background: tokens.cyan,
            color: tokens.bg,
            fontSize: 9,
            fontWeight: 700,
            fontFamily: "var(--font-geist-mono)",
            display: "grid",
            placeItems: "center",
            border: `2px solid ${tokens.bg}`,
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export type RailItem = "home" | "search" | "actions" | "shared" | "archive" | "settings";

interface Userdata {
  id: string,
  name: string,
  email: string,
  image: string,
  createdAt: string,
}
export function Rail({
  active = "home",
  onNav,
  onCreate,
  openActions = 0,
  session
}: {
  active?: RailItem;
  onNav?: (item: RailItem) => void;
  onCreate?: () => void;
  openActions?: number;
  session?: any;
}) {

  const userdata:Userdata = session?.data?.user;
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showAccountMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAccountMenu]);

  return (
    <aside
      style={{
        width: 62,
        borderRight: `1px solid ${tokens.border}`,
        background: tokens.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "14px 0 18px",
        gap: 14,
        flexShrink: 0,
      }}
    >
      {/* Logo mark */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: `conic-gradient(from 200deg at 50% 50%, ${tokens.violet}, ${tokens.cyan}, ${tokens.pink}, ${tokens.violet})`,
          display: "grid",
          placeItems: "center",
          boxShadow: `0 0 20px ${tokens.cyan}33`,
        }}
      >
        <div style={{ width: 9, height: 9, borderRadius: 2, background: tokens.bg }} />
      </div>

      {/* Quick-add primary action */}
      <button
        onClick={onCreate}
        title="New meeting (⌘N)"
        style={{
          width: 38,
          height: 38,
          borderRadius: 9,
          background: tokens.text,
          color: tokens.bg,
          border: "none",
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
          marginTop: 4,
          boxShadow: `0 4px 12px ${tokens.cyan}22`,
        }}
      >
        <PlusIcon />
      </button>

      <div style={{ width: 22, height: 1, background: tokens.border, margin: "4px 0" }} />

      <RailIcon active={active === "home"}    onClick={() => onNav?.("home")}   title="Home"><HomeIcon /></RailIcon>
      <RailIcon active={active === "actions"} badge={openActions > 0 ? String(openActions) : undefined} onClick={() => onNav?.("actions")} title="My actions"><CheckBoxIcon /></RailIcon>
      <RailIcon active={active === "shared"}  onClick={() => onNav?.("shared")} title="Shared"><ShareIcon /></RailIcon>
      <RailIcon active={active === "archive"} onClick={() => onNav?.("archive")}title="Archive"><ArchiveIcon /></RailIcon>

      <div style={{ flex: 1 }} />

      <div ref={accountMenuRef} style={{ position: "relative" }}>
        <RailIcon active={active === "settings" || showAccountMenu} onClick={() => setShowAccountMenu((v) => !v)} title="Settings"><SettingsIcon /></RailIcon>

        {showAccountMenu && (
          <div
            style={{
              position: "absolute",
              left: "calc(100% + 10px)",
              bottom: 0,
              minWidth: 180,
              background: tokens.bg,
              border: `1px solid ${tokens.border}`,
              borderRadius: 10,
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
              padding: 6,
              zIndex: 50,
            }}
          >
            <div
              style={{
                padding: "8px 10px",
                fontSize: 12,
                color: tokens.textDim,
                borderBottom: `1px solid ${tokens.border}`,
                marginBottom: 4,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userdata?.name || userdata?.email}
            </div>
            <button
              onClick={() => {
                setShowAccountMenu(false);
                signOut({ callbackUrl: "/login" });
              }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "8px 10px",
                borderRadius: 6,
                background: "transparent",
                border: "none",
                color: tokens.text,
                fontSize: 13,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 99,
          background: `linear-gradient(135deg, ${tokens.cyan}, ${tokens.violet})`,
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-geist-mono)",
          fontSize: 11,
          fontWeight: 700,
          color: tokens.bg,
          border: `1.5px solid ${tokens.borderStrong}`,
          overflow: "hidden",
        }}
      >
        <img src={userdata?.image} alt={userdata?.name} width={32} height={32}/>
      </div>
    </aside>
  );
}
