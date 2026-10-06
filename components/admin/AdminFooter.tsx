import { techStack } from "@/lib/tech-stack";

export default function AdminFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-4 text-xs text-muted md:flex-row md:justify-between md:gap-6 md:px-8">
        <p>
          © {new Date().getFullYear()} Rabbit House Admin · สร้างขึ้นเป็นผลงาน
          portfolio
        </p>
        <p>Built with {techStack.join(" · ")}</p>
      </div>
    </footer>
  );
}
