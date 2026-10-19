"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { changePassword, login, register, saveAddress, updateProfile, type FormState } from "./actions";
import { US_STATES } from "@/lib/site";

function Field({ name, label, state, type = "text", auto, optional, defaultValue }: { name: string; label: string; state: FormState; type?: string; auto?: string; optional?: boolean; defaultValue?: string | null }) {
  const err = state?.errors?.[name];
  return (
    <div>
      <label className="label" htmlFor={`f-${name}`}>
        {label} {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      <input id={`f-${name}`} name={name} type={type} autoComplete={auto} defaultValue={defaultValue ?? undefined} required={!optional} className="field" aria-invalid={Boolean(err) || undefined} aria-describedby={err ? `f-${name}-err` : undefined} />
      {err && (
        <p id={`f-${name}-err`} className="error-text">
          {err}
        </p>
      )}
    </div>
  );
}

function Submit({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button className="btn btn-primary w-full" disabled={pending}>
      {pending && <Loader2 className="h-5 w-5 animate-spin" />} {children}
    </button>
  );
}

function Message({ state }: { state: FormState }) {
  if (!state?.message) return null;
  return (
    <p role={state.ok ? "status" : "alert"} className={`rounded-xl p-3 text-sm font-semibold ${state.ok ? "bg-leaf-soft text-leaf" : "bg-rose-50 text-rose-700"}`}>
      {state.message}
    </p>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="next" value={next} />
      <Message state={state} />
      <Field name="email" label="Email" type="email" auto="email" state={state} />
      <Field name="password" label="Password" type="password" auto="current-password" state={state} />
      <Submit pending={pending}>Sign In</Submit>
      <p className="text-center text-sm text-muted">
        New here?{" "}
        <Link href={`/account/register?next=${encodeURIComponent(next)}`} className="font-extrabold text-rose-600 hover:underline">
          Create an account
        </Link>
      </p>
      <p className="text-center text-xs text-muted">Forgot your password? Call or email customer care and we&apos;ll reset it for you.</p>
    </form>
  );
}

export function RegisterForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(register, undefined);
  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="next" value={next} />
      <Message state={state} />
      <Field name="name" label="Full name" auto="name" state={state} />
      <Field name="email" label="Email" type="email" auto="email" state={state} />
      <div>
        <Field name="password" label="Password" type="password" auto="new-password" state={state} />
        <p className="mt-1 text-xs text-muted">At least 8 characters.</p>
      </div>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="marketing" className="mt-0.5 h-5 w-5 accent-rose-600" />
        Email me exclusive offers and holiday reminders (10% off your first order).
      </label>
      <Submit pending={pending}>Create Account</Submit>
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href={`/account/login?next=${encodeURIComponent(next)}`} className="font-extrabold text-rose-600 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export function ProfileForm({ name, phone }: { name: string; phone: string | null }) {
  const [state, action, pending] = useActionState(updateProfile, undefined);
  return (
    <form action={action} className="space-y-4">
      <Message state={state} />
      <Field name="name" label="Full name" auto="name" state={state} defaultValue={name} />
      <Field name="phone" label="Phone" type="tel" auto="tel" optional state={state} defaultValue={phone} />
      <Submit pending={pending}>Save Profile</Submit>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, undefined);
  return (
    <form action={action} className="space-y-4">
      <Message state={state} />
      <Field name="current" label="Current password" type="password" auto="current-password" state={state} />
      <Field name="password" label="New password" type="password" auto="new-password" state={state} />
      <Submit pending={pending}>Update Password</Submit>
    </form>
  );
}

export function AddressForm() {
  const [state, action, pending] = useActionState(saveAddress, undefined);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Message state={state} />
      </div>
      <Field name="label" label="Label (e.g. Mom)" optional state={state} />
      <Field name="recipientName" label="Recipient name" state={state} />
      <Field name="recipientPhone" label="Recipient phone" type="tel" state={state} />
      <Field name="company" label="Company / venue" optional state={state} />
      <div className="sm:col-span-2">
        <Field name="street" label="Street address" auto="address-line1" state={state} />
      </div>
      <Field name="apt" label="Apt / suite" optional state={state} />
      <Field name="city" label="City" state={state} />
      <div>
        <label className="label" htmlFor="f-state">
          State
        </label>
        <select id="f-state" name="state" className="field" defaultValue="" aria-invalid={Boolean(state?.errors?.state) || undefined}>
          <option value="">Select a state</option>
          {US_STATES.map(([c, n]) => (
            <option key={c} value={c}>
              {n}
            </option>
          ))}
        </select>
        {state?.errors?.state && <p className="error-text">{state.errors.state}</p>}
      </div>
      <Field name="zip" label="ZIP code" state={state} />
      <div className="sm:col-span-2">
        <Submit pending={pending}>Save Address</Submit>
      </div>
    </form>
  );
}
