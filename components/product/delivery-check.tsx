"use client";

import { useId, useState, type FormEvent } from "react";
import { estimate, formatWindow, isPin } from "@/lib/delivery";
import { Truck } from "@/components/ui/icons";

/** Delivery estimate by PIN code. A concept: dates come from a simple zone table. */
export function DeliveryCheck() {
  const id = useId();
  const [pin, setPin] = useState("");
  const [result, setResult] = useState<{ text: string; ok: boolean } | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const w = estimate(pin);
    if (!isPin(pin) || !w) {
      setResult({ text: "Enter a 6-digit PIN code.", ok: false });
      return;
    }
    setResult({ text: `Delivers ${formatWindow(w)} to ${pin}.`, ok: true });
  };

  return (
    <form onSubmit={submit} noValidate className="rounded-2xl border border-graphite/10 p-4">
      <label htmlFor={id} className="flex items-center gap-2 text-[0.92rem] font-[560]">
        <Truck size={18} /> Check delivery
      </label>
      <div className="mt-3 flex gap-2">
        <input
          id={id}
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder="PIN code"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, ""));
            setResult(null);
          }}
          aria-invalid={result && !result.ok ? true : undefined}
          aria-describedby={`${id}-result`}
          className="field-input min-h-11 flex-1"
        />
        <button type="submit" className="btn btn-ghost min-h-11 px-5">
          Check
        </button>
      </div>
      <p id={`${id}-result`} aria-live="polite" className={`mt-2 min-h-5 text-[0.88rem] ${result && !result.ok ? "text-warn" : "text-graphite-soft"}`}>
        {result?.text ?? "Free delivery across India on orders over ₹5,000."}
      </p>
    </form>
  );
}
