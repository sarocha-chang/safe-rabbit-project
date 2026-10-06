interface PageHeaderProps {
  label: string;
  title: string;
  description?: string;
}

export default function PageHeader({
  label,
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-carrot">{label}</p>
      <h1 className="font-heading text-3xl font-semibold text-ink md:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="max-w-fit leading-relaxed text-muted">{description}</p>
      )}
    </div>
  );
}
