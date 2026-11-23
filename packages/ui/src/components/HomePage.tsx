interface HomePageProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function HomePage({
  title = "Manage content in one focused workspace.",
  description = "Create, search, update, and organize posts with a clean shared interface.",
  actionLabel = "Open Posts",
  actionHref = "/posts",
}: HomePageProps) {
  return (
    <main className="shared-home">
      <section className="shared-home-card">
        <p className="shared-eyebrow">
          Welcome
        </p>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          {title}
        </h1>
        <p className="shared-home-description">
          {description}
        </p>
        <a
          href={actionHref}
          className="shared-primary-link"
        >
          {actionLabel}
        </a>
      </section>
    </main>
  );
}
