"use client";

import { useToggle } from "@/hooks";
import Tooltip from "@/ui/tooltip";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const ChainSwitch = dynamic(() => import("@/components/chain-switch"), { ssr: false });
const HistoryNav = dynamic(() => import("@/components/history-nav"), { ssr: false });
const User = dynamic(() => import("@/components/user"), { ssr: false });
const Drawer = dynamic(() => import("@/ui/drawer"), { ssr: false });

interface NavigationConfig {
  label: string;
  href: string;
  external?: boolean;
  soon?: boolean;
  disabled?: boolean;
}

const navigationsConfig: NavigationConfig[] = [
  { href: "/", label: "Bridge" },
  { href: "/records", label: "Explore" },
  { href: "https://assethub-bridge.darwinia.network", label: "Assethub", external: true },
];

export default function Header() {
  const { state: isOpen, setTrue: setIsOpenTrue, setFalse: setIsOpenFalse } = useToggle(false);
  const pathname = usePathname();

  return (
    <>
      <div className="app-header fixed left-0 top-0 z-10 flex w-full items-center justify-between border-b border-b-white/25 bg-transparent px-medium lg:border-b-transparent lg:px-5">
        {/* Left */}
        <div className="flex items-center gap-5">
          <Link href="/">
            <Image width={152} height={18} alt="Logo" src="/images/projects/darwinia.png" />
          </Link>

          <div className="hidden items-center gap-medium lg:flex">
            {navigationsConfig.map(({ href, label, external, soon, disabled }) =>
              external ? (
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href={href}
                  key={label}
                  className={`rounded-full px-3 py-small text-sm font-bold text-white/50 transition hover:bg-white/10 hover:text-white active:translate-y-1`}
                >
                  {label}
                </a>
              ) : soon || disabled ? (
                <Tooltip key={label} content={soon ? "Coming soon" : "This feature is temporarily under maintenance"}>
                  <span className="rounded-full px-3 py-small text-sm font-bold text-white/50">{label}</span>
                </Tooltip>
              ) : (
                <Link
                  key={label}
                  href={href}
                  className={`rounded-full px-3 py-small text-sm font-bold transition-all hover:bg-white/10 hover:text-white active:translate-y-1 ${
                    pathname === href ? "text-white underline decoration-2 underline-offset-8" : "text-white/50"
                  }`}
                >
                  {label}
                </Link>
              ),
            )}
          </div>
        </div>

        {/* Right */}
        <div className="hidden items-center gap-medium lg:flex">
          <HistoryNav />
          <User placement="bottom-end" prefixLength={14} suffixLength={10} />
          <ChainSwitch placement="bottom-end" />
        </div>
        <Image
          width={24}
          height={24}
          alt="Menu"
          src="/images/menu.svg"
          className="inline transition-transform active:translate-y-1 lg:hidden"
          onClick={setIsOpenTrue}
        />
      </div>

      <Drawer maskClosable isOpen={isOpen} onClose={setIsOpenFalse}>
        <div className="flex w-full items-start justify-center" style={{ marginTop: "20%" }}>
          <div className="flex w-max flex-col items-start gap-10">
            <div className="flex flex-col gap-large">
              {navigationsConfig.map(({ label, href, external, soon, disabled }) =>
                external ? (
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href={href}
                    key={label}
                    className={`text-sm font-bold ${
                      pathname === href ? "text-primary underline decoration-2 underline-offset-4" : "text-white"
                    }`}
                  >
                    {label}
                  </a>
                ) : soon || disabled ? (
                  <Tooltip key={label} content={soon ? "Coming soon" : "This feature is temporarily under maintenance"}>
                    <span className="text-sm font-bold text-white/50">{label}</span>
                  </Tooltip>
                ) : (
                  <Link
                    key={label}
                    href={href}
                    className={`text-sm font-bold ${
                      pathname === href ? "text-primary underline decoration-2 underline-offset-4" : "text-white"
                    }`}
                    onClick={setIsOpenFalse}
                  >
                    {label}
                  </Link>
                ),
              )}
            </div>

            <div className="flex flex-col gap-2">
              <ChainSwitch />
              <User placement="bottom" onComplete={setIsOpenFalse} />
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}
