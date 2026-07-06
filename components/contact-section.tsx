import Link from "next/link";

type ContactSectionProps = {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
};

export default function ContactSection({
  title = "Contact",
  description = "制作のご相談やお問い合わせは、こちらからご連絡ください。",
  primaryHref = "/",
  primaryLabel = "お問い合わせ",
}: ContactSectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 sm:px-8 lg:px-10 lg:pb-20">
      <div className="grid gap-8 border-t border-b border-black/8 py-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="space-y-3">
          <p className="text-[11px] tracking-[0.24em] text-black/45">CONTACT</p>
          <h2 className="text-2xl font-light tracking-[-0.03em] text-black sm:text-3xl">
            {title}
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-black/65">
            {description}
          </p>
        </div>

        <Link
          href={primaryHref}
          className="inline-flex items-center gap-3 border border-black/10 px-5 py-3 text-sm text-black transition hover:bg-black hover:text-white"
        >
          <span>{primaryLabel}</span>
          <span
            aria-hidden="true"
            className="flex h-6 w-6 items-center justify-center rounded-full border border-current text-[11px] leading-none"
          >
            &gt;
          </span>
        </Link>
      </div>
    </section>
  );
}
