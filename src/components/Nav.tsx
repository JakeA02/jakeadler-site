export function Nav() {
  const links = [["Story", "#founder"], ["Projects", "#projects"], ["Writing", "#writer"], ["Me", "#personal"], ["Contact", "#contact"]];
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-4 mix-blend-multiply">
      <a href="#" className="font-serif text-lg">Jake Adler</a>
      <nav className="flex gap-5 text-sm text-ink-soft">
        {links.map(([l, h]) => (<a key={h} href={h} className="hover:text-ink">{l}</a>))}
      </nav>
    </header>
  );
}
