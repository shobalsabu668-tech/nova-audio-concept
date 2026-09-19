"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { finishes } from "@/lib/catalogue";
import { cn, formatMoney } from "@/lib/format";
import { renderSrc } from "@/lib/renders";
import { author, site } from "@/lib/site";
import { EXPRESS_FEE, estimate, formatWindow, isPin, states } from "@/lib/delivery";
import { useCart, type DetailedLine } from "@/components/cart/cart-context";
import { Check } from "@/components/ui/icons";

type Form = {
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  delivery: "standard" | "express";
  payment: "upi" | "card" | "cod";
};

type Errors = Partial<Record<keyof Form, string>>;

const empty: Form = { email: "", name: "", phone: "", address: "", city: "", state: "Karnataka", pin: "", delivery: "standard", payment: "upi" };

function validate(f: Form): Errors {
  const e: Errors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Enter an email for the order confirmation.";
  if (f.name.trim().length < 2) e.name = "Enter the name for delivery.";
  if (!/^[6-9]\d{9}$/.test(f.phone.replace(/\D/g, "").slice(-10)) || f.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a 10-digit Indian mobile number.";
  if (f.address.trim().length < 6) e.address = "Enter the street address.";
  if (!f.city.trim()) e.city = "Enter the city.";
  if (!isPin(f.pin)) e.pin = "Enter a 6-digit PIN code.";
  return e;
}

type Order = { number: string; lines: DetailedLine[]; subtotal: number; delivery: number; total: number; form: Form; window: string };

/**
 * CHECKOUT — one page, top to bottom: contact, address, delivery, payment.
 * Validation is inline and focuses the first problem. Delivery dates come
 * from the PIN code as soon as it's typed. There are deliberately no card
 * fields: a real store hands payment to its payment provider, and a concept
 * shouldn't ask for payment details at all.
 */
export function Checkout() {
  const id = useId();
  const cart = useCart();
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const done = useRef<HTMLHeadingElement>(null);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    const next = { ...form, [k]: v };
    setForm(next);
    if (submitted) setErrors(validate(next));
  };

  const standardFee = cart.subtotal >= site.freeShippingOver ? 0 : 250;
  const deliveryFee = form.delivery === "express" ? EXPRESS_FEE : standardFee;
  const total = cart.subtotal + deliveryFee;
  const win = useMemo(() => ({ standard: estimate(form.pin), express: estimate(form.pin, true) }), [form.pin]);

  useEffect(() => {
    if (order) done.current?.focus();
  }, [order]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const found = validate(form);
    setErrors(found);
    const first = (Object.keys(empty) as (keyof Form)[]).find((k) => found[k]);
    if (first) {
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    setPlacing(true);
    setTimeout(() => {
      const w = win[form.delivery];
      setOrder({
        number: `NV-${Math.floor(100000 + Math.random() * 900000)}`,
        lines: cart.lines,
        subtotal: cart.subtotal,
        delivery: deliveryFee,
        total,
        form,
        window: w ? formatWindow(w) : "",
      });
      cart.clear();
      setPlacing(false);
      window.scrollTo({ top: 0 });
    }, 900);
  };

  if (order) {
    return (
      <div className="shell grid gap-10 py-12 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <span className="grid size-14 place-items-center rounded-full bg-ok text-white" aria-hidden="true">
            <Check size={22} />
          </span>
          <p className="t-eyebrow mt-8">Order {order.number}</p>
          <h1 ref={done} tabIndex={-1} className="t-h2 mt-3 outline-none">
            Thank you, {order.form.name.split(" ")[0]}.
          </h1>
          <p className="t-lead mt-5">
            In a real store, your order would arrive {order.window} at {order.form.pin}, and a confirmation would go to {order.form.email}.
          </p>
          <div className="mt-8 rounded-[22px] border border-graphite/15 bg-paper p-6">
            <p className="font-[620]">This was a demonstration.</p>
            <p className="t-body mt-2">
              NØVA is a self-initiated concept by {author.name}. Nothing was ordered or charged, and the details you entered
              were never sent anywhere; they existed only in this tab. In a real build, this step would create the order in the
              store&rsquo;s commerce platform and hand payment to its payment provider.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-dark">
              Keep browsing
            </Link>
            <a href={author.caseStudy} className="btn btn-ghost">
              See the case study
            </a>
          </div>
        </div>
        <OrderSummary lines={order.lines} subtotal={order.subtotal} delivery={order.delivery} total={order.total} />
      </div>
    );
  }

  if (!cart.ready) return <div className="shell py-16"><div className="h-96 animate-pulse rounded-[22px] bg-paper" aria-busy="true" /></div>;

  if (!cart.lines.length) {
    return (
      <div className="shell py-20 text-center">
        <h1 className="t-h2">Checkout</h1>
        <p className="t-lead mt-4">Your bag is empty.</p>
        <Link href="/shop" className="btn btn-dark mt-8">
          Browse the range
        </Link>
      </div>
    );
  }

  const field = (k: keyof Form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, className = "") => (
    <div className={className}>
      <label htmlFor={`${id}-${k}`} className="mb-1.5 block text-[0.9rem] font-[560]">
        {label}
      </label>
      <input
        id={`${id}-${k}`}
        value={form[k] as string}
        onChange={(e) => set(k, e.target.value as Form[typeof k])}
        aria-invalid={errors[k] ? true : undefined}
        aria-describedby={errors[k] ? `${id}-${k}-err` : undefined}
        className="field-input"
        {...props}
      />
      {errors[k] ? (
        <p id={`${id}-${k}-err`} className="field-error mt-1.5">
          {errors[k]}
        </p>
      ) : null}
    </div>
  );

  const legend = (n: number, text: string) => (
    <legend className="flex items-center gap-3 text-[1.2rem] font-[640]">
      <span className="t-price grid size-7 place-items-center rounded-full bg-graphite text-[0.8rem] text-bone">{n}</span>
      {text}
    </legend>
  );

  return (
    <div className="shell grid gap-10 py-10 md:py-14 lg:grid-cols-12 lg:gap-8">
      <form onSubmit={submit} noValidate className="space-y-10 lg:col-span-7" aria-labelledby={`${id}-title`}>
        <div>
          <h1 id={`${id}-title`} className="t-h2">
            Checkout
          </h1>
          <p className="mt-3 text-[0.92rem] text-graphite-soft">A concept checkout: nothing will be charged, and nothing you type leaves this page.</p>
        </div>

        <fieldset className="space-y-4">
          {legend(1, "Contact")}
          {field("email", "Email", { type: "email", autoComplete: "email", inputMode: "email" })}
          {field("phone", "Mobile number", { type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "+91 98xxx xxxxx" })}
        </fieldset>

        <fieldset className="space-y-4">
          {legend(2, "Delivery address")}
          {field("name", "Full name", { autoComplete: "name" })}
          {field("address", "Address", { autoComplete: "street-address", placeholder: "House no., building, street, area" })}
          <div className="grid gap-4 sm:grid-cols-3">
            {field("city", "City", { autoComplete: "address-level2" })}
            <div>
              <label htmlFor={`${id}-state`} className="mb-1.5 block text-[0.9rem] font-[560]">
                State
              </label>
              <select id={`${id}-state`} value={form.state} onChange={(e) => set("state", e.target.value)} autoComplete="address-level1" className="field-input cursor-pointer">
                {states.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            {field("pin", "PIN code", { inputMode: "numeric", autoComplete: "postal-code", maxLength: 6, onChange: (e) => set("pin", e.target.value.replace(/\D/g, "")) })}
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          {legend(3, "Delivery")}
          {(["standard", "express"] as const).map((d) => {
            const w = win[d];
            const fee = d === "express" ? EXPRESS_FEE : standardFee;
            return (
              <label
                key={d}
                className={cn(
                  "flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ion-deep",
                  form.delivery === d ? "border-graphite bg-paper" : "border-graphite/15 hover:border-graphite/40",
                )}
              >
                <input type="radio" name={`${id}-delivery`} checked={form.delivery === d} onChange={() => set("delivery", d)} className="size-4 accent-ion-deep" />
                <span className="flex-1">
                  <span className="block font-[600]">{d === "express" ? "Express" : "Standard"}</span>
                  <span className="block text-[0.88rem] text-graphite-soft">{w ? `Arrives ${formatWindow(w)}` : "Enter your PIN code to see dates"}</span>
                </span>
                <span className="t-price">{fee ? formatMoney(fee) : "Free"}</span>
              </label>
            );
          })}
        </fieldset>

        <fieldset className="space-y-3">
          {legend(4, "Payment")}
          {(
            [
              { id: "upi", label: "UPI", note: "Pay from any UPI app" },
              { id: "card", label: "Credit or debit card", note: "On the payment provider's secure page" },
              { id: "cod", label: "Cash on delivery", note: "Pay when it arrives" },
            ] as const
          ).map((p) => (
            <label
              key={p.id}
              className={cn(
                "flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ion-deep",
                form.payment === p.id ? "border-graphite bg-paper" : "border-graphite/15 hover:border-graphite/40",
              )}
            >
              <input type="radio" name={`${id}-payment`} checked={form.payment === p.id} onChange={() => set("payment", p.id)} className="size-4 accent-ion-deep" />
              <span className="flex-1">
                <span className="block font-[600]">{p.label}</span>
                <span className="block text-[0.88rem] text-graphite-soft">{p.note}</span>
              </span>
            </label>
          ))}
          <p className="text-[0.85rem] text-graphite-soft">
            No payment details are collected here. In a real store, placing the order would open the payment provider&rsquo;s own secure page.
          </p>
        </fieldset>

        <div className="border-t border-graphite/10 pt-6">
          <button type="submit" disabled={placing} className="btn btn-primary w-full sm:w-auto sm:min-w-72">
            {placing ? "Placing order…" : `Place order · ${formatMoney(total)}`}
          </button>
          {submitted && Object.keys(errors).length ? (
            <p role="alert" className="field-error mt-3">
              Please check the {Object.keys(errors).length === 1 ? "highlighted field" : `${Object.keys(errors).length} highlighted fields`}.
            </p>
          ) : null}
        </div>
      </form>

      <OrderSummary lines={cart.lines} subtotal={cart.subtotal} delivery={deliveryFee} total={total} />
    </div>
  );
}

function OrderSummary({ lines, subtotal, delivery, total }: { lines: DetailedLine[]; subtotal: number; delivery: number; total: number }) {
  return (
    <aside aria-labelledby="order-summary" className="lg:col-span-4 lg:col-start-9">
      <div className="card p-6 lg:sticky lg:top-24">
        <h2 id="order-summary" className="text-[1.1rem] font-[640]">
          Order summary
        </h2>
        <ul className="mt-5 space-y-4">
          {lines.map((l) => (
            <li key={l.variantId} className="flex items-center gap-4">
              <span className="relative size-16 shrink-0 rounded-xl bg-bone">
                <Image src={renderSrc(l.product, l.variant.finish)} alt="" fill sizes="64px" className="object-contain p-1.5" />
                <span className="t-price absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-graphite text-[0.68rem] text-bone">{l.qty}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-[600]">{l.product.title}</span>
                <span className="block text-[0.85rem] text-graphite-soft">
                  {finishes[l.variant.finish].name} · Qty {l.qty}
                </span>
              </span>
              <span className="t-price text-[0.95rem]">{formatMoney(l.total)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-graphite/10 pt-5 text-[0.95rem]">
          <div className="flex justify-between">
            <dt className="text-graphite-soft">Subtotal</dt>
            <dd className="t-price">{formatMoney(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-graphite-soft">Delivery</dt>
            <dd className="t-price">{delivery ? formatMoney(delivery) : "Free"}</dd>
          </div>
          <div className="flex justify-between border-t border-graphite/10 pt-3 text-[1.15rem]">
            <dt className="font-[620]">Total</dt>
            <dd className="t-price">{formatMoney(total)}</dd>
          </div>
        </dl>
        <p className="mt-2 text-[0.82rem] text-graphite-soft">Including GST.</p>
      </div>
    </aside>
  );
}
