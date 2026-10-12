"use client";

import { useId, useState } from "react";

import Section from "@/components/Section";
import { content } from "@/content/content";

type Status = "idle" | "submitting" | "success" | "error";

const FIELD_CLASS =
  "w-full rounded-lg border border-white/15 bg-[rgb(7_11_31/0.75)] px-3.5 py-2.5 text-sm text-[var(--white)] placeholder:text-[var(--muted)] transition-colors focus:border-[var(--glow)]";

function Label({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-[var(--muted-strong)]"
    >
      {children}
    </label>
  );
}

export default function Contact() {
  const { contact } = content;
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");

  const fieldId = (name: string) => `${uid}-${name}`;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <Section
      id={contact.id}
      eyebrow={contact.eyebrow}
      heading={contact.heading}
      intro={contact.intro}
    >
      <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start">
        <div className="card-surface rounded-2xl p-6 sm:p-8">
          {status === "success" ? (
            <div role="status" className="py-10 text-center">
              <h3 className="text-xl font-semibold text-[var(--white)]">
                {contact.successHeading}
              </h3>
              <p className="mt-3 text-sm text-[var(--muted-strong)]">
                {contact.successBody}
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate={false}>
              {/* Honeypot. Hidden from people, tempting to bots. */}
              <div aria-hidden="true" className="absolute left-[-9999px]">
                <label htmlFor={fieldId("company")}>Company</label>
                <input
                  id={fieldId("company")}
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor={fieldId("name")}>{contact.fields.name}</Label>
                  <input
                    id={fieldId("name")}
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    maxLength={120}
                    className={FIELD_CLASS}
                  />
                </div>

                <div>
                  <Label htmlFor={fieldId("practice")}>
                    {contact.fields.practice}
                  </Label>
                  <input
                    id={fieldId("practice")}
                    name="practice"
                    type="text"
                    autoComplete="organization"
                    maxLength={160}
                    className={FIELD_CLASS}
                  />
                </div>

                <div>
                  <Label htmlFor={fieldId("role")}>{contact.fields.role}</Label>
                  <select
                    id={fieldId("role")}
                    name="role"
                    defaultValue=""
                    className={FIELD_CLASS}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {contact.roleOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor={fieldId("size")}>{contact.fields.size}</Label>
                  <select
                    id={fieldId("size")}
                    name="size"
                    defaultValue=""
                    className={FIELD_CLASS}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {contact.sizeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor={fieldId("email")}>
                    {contact.fields.email}
                  </Label>
                  <input
                    id={fieldId("email")}
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    maxLength={200}
                    className={FIELD_CLASS}
                  />
                </div>

                <div>
                  <Label htmlFor={fieldId("phone")}>
                    {contact.fields.phone}
                  </Label>
                  <input
                    id={fieldId("phone")}
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={40}
                    className={FIELD_CLASS}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor={fieldId("message")}>
                    {contact.fields.message}
                  </Label>
                  <textarea
                    id={fieldId("message")}
                    name="message"
                    rows={4}
                    maxLength={4000}
                    className={`${FIELD_CLASS} resize-y`}
                  />
                </div>
              </div>

              <p className="mt-5 text-xs leading-relaxed text-[var(--muted)]">
                {contact.privacyNote}
              </p>

              {status === "error" ? (
                <p
                  role="alert"
                  className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200"
                >
                  {contact.errorBody}{" "}
                  <a
                    href={`mailto:${content.brand.email}`}
                    className="underline underline-offset-4"
                  >
                    {content.brand.email}
                  </a>
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--white)] px-7 py-3.5 text-sm font-semibold text-[#0a0f2b] transition-transform duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting"
                  ? contact.submittingLabel
                  : contact.submitLabel}
              </button>
            </form>
          )}
        </div>

        {/* Scheduling embed placeholder — drop the provider snippet in here. */}
        <aside className="card-surface rounded-2xl p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-[var(--white)]">
            {contact.schedulerPlaceholder.heading}
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)]">
            {contact.schedulerPlaceholder.body}
          </p>

          {content.scheduler.embedUrl ? (
            <iframe
              src={content.scheduler.embedUrl}
              title={content.scheduler.title}
              loading="lazy"
              className="mt-6 h-[640px] w-full rounded-xl border border-white/10 bg-white"
            />
          ) : (
            <div
              data-scheduler-embed
              className="mt-6 flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center"
            >
              <p className="font-mono text-[0.7rem] leading-relaxed tracking-[0.12em] text-[var(--muted)] uppercase">
                Scheduling embed
                <br />
                goes here
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2">
            <a
              href={`tel:${content.brand.phoneHref}`}
              className="text-sm font-medium text-[var(--glow)] underline-offset-4 hover:underline"
            >
              {content.brand.phone}
            </a>
            <a
              href={`mailto:${content.brand.email}`}
              className="text-sm font-medium text-[var(--glow)] underline-offset-4 hover:underline"
            >
              {content.brand.email}
            </a>
          </div>
        </aside>
      </div>
    </Section>
  );
}
