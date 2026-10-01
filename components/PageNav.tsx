import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/audit", label: "New audit" },
  { href: "/history", label: "History" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
];

export default function PageNav({ active }: { active: string }) {
  return (
    <nav className="flex flex-wrap gap-x-5 gap-y-2 mb-8 text-sm">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={l.href === active ? "text-emerald-400 font-semibold" : "text-gray-400 hover:text-white"}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
