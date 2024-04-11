import { BaseBridge } from "@/bridges";
import { Token } from "@/types";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { from } from "rxjs";

export function useMessageFee(
  bridge: BaseBridge | undefined,
  sender: Address | undefined,
  recipient: Address | undefined,
  amount: bigint,
) {
  const [fee, setFee] = useState<{ token: Token; value: bigint } | null>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const sub$$ = from(
      bridge?.getFee({
        sender,
        recipient,
        transferAmount: amount,
      }) || Promise.resolve(undefined),
    ).subscribe({
      next: (res) => {
        setLoading(false);
        setFee(res);
      },
      error: (err) => {
        console.error(err);
        setLoading(false);
        setFee(null);
      },
    });

    return () => {
      sub$$.unsubscribe();
    };
  }, [bridge, amount, sender, recipient]);

  return { loading, fee };
}
