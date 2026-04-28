export default function Loading() {
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 py-20 text-center text-ink-mute">
      <div
        className="inline-block w-6 h-6 border-2 border-ink-border border-t-accent rounded-full animate-spin mb-3"
        role="status"
        aria-label="Lädt …"
      />
      <div className="text-sm">Lädt …</div>
    </div>
  );
}
