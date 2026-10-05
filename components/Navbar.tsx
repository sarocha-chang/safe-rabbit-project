import Link from "next/link";

const navItems = [
  {
    label: "หาบ้าน",
    href: "/rabbits",
  },
  {
    label: "ได้บ้านแล้ว",
    href: "/rabbits/adopted",
  },
  {
    label: "สตาฟคาเฟ่",
    href: "/rabbits/cafe-staff",
  },
  {
    label: "เกี่ยวกับเรา",
    href: "/about",
  },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-5 md:px-8">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-medium text-ink">
          <span className="h-2.5 w-2.5 rounded-full bg-carrot" />
          Safe Rabbit
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-sm text-muted transition hover:bg-cream hover:text-brown"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
