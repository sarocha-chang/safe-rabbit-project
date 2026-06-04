import Link from "next/link";

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Find Home",
    href: "/rabbits",
  },
  {
    label: "Adopted",
    href: "/rabbits/adopted",
  },
  {
    label: "Cafe Staff",
    href: "/rabbits/cafe-staff",
  },
  {
    label: "About",
    href: "/about",
  },
];

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Safe Rabbit 🐰
        </Link>

        <div className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-black hover:text-gray-500 transition"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
