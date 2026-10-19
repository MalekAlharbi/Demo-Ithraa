import type { ReactNode } from 'react';

interface PageHeadingProps {
  title: string;
  description: string;
  actions?: ReactNode;
  eyebrow?: string;
}

export default function PageHeading({ title, description, actions, eyebrow = 'إثراء الخير · نظام الموارد البشرية' }: PageHeadingProps) {
  return (
    <header className="page-heading mb-6 flex flex-wrap items-center justify-between gap-5 px-5 py-5 sm:px-7 sm:py-6">
      <div className="relative z-10">
        <p className="page-heading-eyebrow mb-1.5 text-xs font-semibold tracking-wide">{eyebrow}</p>
        <h1 className="font-display text-2xl font-extrabold sm:text-[1.8rem]">{title}</h1>
        <p className="page-heading-description mt-1.5 text-sm">{description}</p>
      </div>
      {actions && <div className="page-heading-action">{actions}</div>}
    </header>
  );
}
