import { Key, ReactElement, useRef } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";

export interface TabsProps<T> {
  activeTab: T;
  options: {
    tab: T;
    label: string;
    children: ReactElement;
  }[];
  onChange?: (tab: T) => void;
}

export default function BridgeTabs<K extends Key = string>({
  options,
  activeTab,
  onChange = () => undefined,
}: TabsProps<K>) {
  const previousRef = useRef<HTMLDivElement | null>(null);
  const currentRef = useRef<HTMLDivElement | null>(null);

  const nodeRef = options.findIndex((option) => option.tab === activeTab) % 2 ? currentRef : previousRef;
  const activeItem = options.find(({ tab }) => tab === activeTab) || options[0];

  return (
    <>
      <div className="flex items-center justify-between gap-medium rounded-xl bg-background p-2">
        {options.map((option) => (
          <button
            key={option.tab}
            disabled={option.tab === activeTab}
            onClick={() => onChange(option.tab)}
            className="h-9 flex-1 rounded-lg text-sm font-bold text-white transition-colors hover:bg-white/10 disabled:bg-white/20"
          >
            {option.label}
          </button>
        ))}
      </div>

      <SwitchTransition>
        <CSSTransition timeout={200} key={activeTab} nodeRef={nodeRef} classNames="tabs-fade" unmountOnExit>
          <div ref={nodeRef} className="flex flex-col gap-medium lg:gap-5">
            {activeItem.children}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </>
  );
}
