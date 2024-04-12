import Image from "next/image";

const bridgeOptions: { name: string; logo: string; link: string }[] = [
  { name: "Helix Bridge", logo: "helix-bridge.png", link: "https://helixbridge.app" },
];

export default function ThirdPartyBridge() {
  return (
    <div className="flex flex-col gap-small rounded-large bg-background p-medium">
      {bridgeOptions.map((option) => (
        <a
          key={option.name}
          className="inline-flex items-center justify-between rounded-xl px-3 py-medium transition-colors hover:bg-white/5"
          rel="noopener noreferrer"
          target="_blank"
          href={option.link}
        >
          <div className="inline-flex items-center gap-medium truncate">
            <Image
              width={38}
              height={38}
              alt={option.name}
              src={`/images/third-party-bridges/${option.logo}`}
              className="shrink-0"
            />
            <span className="truncate text-sm font-bold italic text-white">{option.name}</span>
          </div>

          <ExternalIcon />
        </a>
      ))}
    </div>
  );
}

function ExternalIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M3.2 16C1.43269 16 0 14.5673 0 12.8V3.20001C0 1.4327 1.43269 7.76358e-06 3.2 7.76358e-06H5.33333C5.71538 -0.00144664 6.06904 0.201538 6.26049 0.532165C6.45194 0.862792 6.45194 1.27056 6.26049 1.60119C6.06904 1.93182 5.71538 2.1348 5.33333 2.13334H3.2C2.61089 2.13334 2.13333 2.61091 2.13333 3.20001V12.8C2.13334 13.3891 2.6109 13.8667 3.2 13.8667H12.8C13.3891 13.8667 13.8667 13.3891 13.8667 12.8V10.6667C13.8689 10.0792 14.3458 9.60407 14.9333 9.60407C15.5208 9.60407 15.9978 10.0792 16 10.6667V12.8C16 14.5673 14.5673 16 12.8 16H3.2ZM4.5792 11.424C4.37858 11.2239 4.26583 10.9522 4.26583 10.6688C4.26583 10.3854 4.37858 10.1137 4.5792 9.9136L12.3584 2.13867H9.6C9.01249 2.13642 8.53741 1.65952 8.53741 1.07201C8.53741 0.484494 9.01249 0.00759232 9.6 0.00534373H14.9333C15.5224 0.00534373 16 0.482909 16 1.07201V6.40534C15.9978 6.99285 15.5208 7.46793 14.9333 7.46793C14.3458 7.46793 13.8689 6.99285 13.8667 6.40534V3.64482L6.08745 11.4315C5.66924 11.8438 4.99741 11.8438 4.5792 11.4315V11.424Z"
        fill="white"
      />
    </svg>
  );
}
