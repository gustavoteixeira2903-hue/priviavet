"use client";

import {
  ReactNode,
  useState,
} from "react";
import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import { PriviaLogo } from "@/components/brand/privia-logo";
import { logoutUser } from "@/services/api";
import {
  canManageWorkspace,
  workspaceRoleLabel,
} from "@/lib/workspace-permissions";

type AppShellProps = {
  title: string;
  eyebrow?: string;
  userName?: string;
  userEmail?: string;
  workspaceName?: string;
  workspaceRole?: string;
  actions?: ReactNode;
  children: ReactNode;
};

type NavigationItem = {
  href: string;
  label: string;
  description: string;
  code: string;
  managerOnly?: boolean;
};

const navigation: NavigationItem[] = [
  {
    href: "/dashboard",
    label: "Visão geral",
    description: "Central de operações",
    code: "01",
  },
  {
    href: "/clientes",
    label: "Clientes",
    description: "Empresas atendidas",
    code: "02",
  },
  {
    href: "/projetos",
    label: "Projetos LGPD",
    description: "Diagnósticos e adequação",
    code: "03",
  },
  {
    href: "/pendencias",
    label: "Pendências",
    description: "Prazos e atividades",
    code: "04",
  },
  {
    href: "/equipe",
    label: "Equipe",
    description: "Usuários e funções",
    code: "05",
  },
  {
    href: "/auditoria",
    label: "Auditoria",
    description: "Histórico de atividades",
    code: "06",
    managerOnly: true,
  },
];

export function AppShell({
  title,
  eyebrow = "Privia",
  userName,
  userEmail,
  workspaceName,
  workspaceRole,
  actions,
  children,
}: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const visibleNavigation =
    navigation.filter(
      (item) =>
        !item.managerOnly ||
        canManageWorkspace(workspaceRole),
    );

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  }

  async function handleLogout() {
    try {
      await logoutUser();
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#1f2937]">
      {menuOpen && (
        <button
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-[#14213d]/55 backdrop-blur-sm lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#14213d] shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          menuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-6 py-6">
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
          >
            <PriviaLogo light />
          </Link>
        </div>

        <div className="px-4 py-6">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d6bd8a]">
            Navegação
          </p>

          <nav className="mt-4 space-y-1.5">
            {visibleNavigation.map(
              (item) => {
                const active =
                  isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className={`group flex items-center gap-3 rounded-xl border px-3 py-3 transition ${
                      active
                        ? "border-[#d6bd8a]/40 bg-white text-[#14213d] shadow-sm"
                        : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold ${
                        active
                          ? "bg-[#b08d57] text-white"
                          : "bg-white/[0.07] text-[#d6bd8a]"
                      }`}
                    >
                      {item.code}
                    </span>

                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">
                        {item.label}
                      </span>

                      <span
                        className={`block truncate text-[11px] ${
                          active
                            ? "text-slate-500"
                            : "text-slate-500"
                        }`}
                      >
                        {item.description}
                      </span>
                    </span>
                  </Link>
                );
              },
            )}
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 p-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.055] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#b08d57] text-sm font-semibold text-white">
                {(userName || "U")
                  .slice(0, 1)
                  .toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {userName || "Usuário"}
                </p>

                <p className="truncate text-xs text-slate-400">
                  {userEmail || workspaceName}
                </p>

                {workspaceRole && (
                  <span className="mt-2 inline-flex rounded-full border border-[#d6bd8a]/30 bg-[#b08d57]/15 px-2 py-1 text-[10px] font-medium text-[#e5cf9e]">
                    {workspaceRoleLabel(
                      workspaceRole,
                    )}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-4 w-full rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-red-300/30 hover:bg-red-400/10 hover:text-red-100"
            >
              Encerrar sessão
            </button>
          </div>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-[#e5e1d8] bg-white/90 backdrop-blur-xl">
          <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-4">
              <button
                onClick={() => setMenuOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#ded8cc] bg-white shadow-sm lg:hidden"
                aria-label="Abrir menu"
              >
                <span className="space-y-1">
                  <span className="block h-0.5 w-4 bg-[#14213d]" />
                  <span className="block h-0.5 w-4 bg-[#14213d]" />
                  <span className="block h-0.5 w-4 bg-[#14213d]" />
                </span>
              </button>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8c6d3d]">
                  {eyebrow}
                </p>

                <h1 className="truncate text-lg font-semibold tracking-tight text-[#14213d] sm:text-xl">
                  {title}
                </h1>
              </div>
            </div>

            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        </header>

        <main className="relative p-4 sm:p-6 lg:p-8">
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}