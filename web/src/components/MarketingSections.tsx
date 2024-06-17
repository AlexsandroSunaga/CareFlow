type Faq = { q: string; a: string };

export function PageHero({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <header className="max-w-3xl">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{eyebrow}</p> : null}
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{title}</h1>
      {subtitle ? <p className="mt-4 text-lg text-slate-600">{subtitle}</p> : null}
    </header>
  );
}

export function FeatureGrid({ items }: { items: { title: string; body: string }[] }) {
  return (
    <section className="mt-10 grid gap-4 md:grid-cols-2">
      {items.map((f) => (
        <article key={f.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900">{f.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{f.body}</p>
        </article>
      ))}
    </section>
  );
}

export function StatsRow({ items }: { items: { label: string; value: string }[] }) {
  return (
    <section className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/40 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s) => (
        <div key={s.label}>
          <p className="text-2xl font-semibold">{s.value}</p>
          <p className="mt-1 text-sm text-slate-500">{s.label}</p>
        </div>
      ))}
    </section>
  );
}

export function ProcessSteps({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="mt-10 grid gap-4 md:grid-cols-3">
      {steps.map((s, i) => (
        <li key={s.title} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Step {i + 1}</span>
          <h3 className="mt-2 font-semibold">{s.title}</h3>
          <p className="mt-2 text-sm text-slate-500">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function FaqSection({ items }: { items: Faq[] }) {
  return (
    <section className="mt-16">
      <h2 className="text-xl font-semibold">Frequently asked questions</h2>
      <dl className="mt-6 space-y-4">
        {items.map((f) => (
          <div key={f.q} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <dt className="font-medium">{f.q}</dt>
            <dd className="mt-2 text-sm text-slate-500">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function CtaBand({ title, body, primaryHref, primaryLabel, secondaryHref, secondaryLabel }: {
  title: string;
  body: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="mt-16 rounded-2xl bg-slate-900 px-8 py-10 text-center text-white">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300">{body}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a href={primaryHref} className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-slate-900">
          {primaryLabel}
        </a>
        {secondaryHref && secondaryLabel ? (
          <a href={secondaryHref} className="rounded-full border border-slate-600 px-5 py-2.5 text-sm">
            {secondaryLabel}
          </a>
        ) : null}
      </div>
    </section>
  );
}
