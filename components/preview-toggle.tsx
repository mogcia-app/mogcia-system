type PreviewToggleProps = {
  src: string;
};

export default function PreviewToggle({ src }: PreviewToggleProps) {
  return (
    <a
      href={src}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-3 border border-black/10 bg-white/92 px-5 py-3 text-sm text-black transition hover:bg-black hover:text-white"
    >
      <span>プレビュー</span>
      <span
        aria-hidden="true"
        className="flex h-6 w-6 items-center justify-center rounded-full border border-current text-[11px] leading-none"
      >
        &gt;
      </span>
    </a>
  );
}
