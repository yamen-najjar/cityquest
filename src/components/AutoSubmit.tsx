'use client';

/** A GET form that applies itself when a select changes. Without JavaScript the submit button still works. */
export function AutoSubmitForm({
  children,
  className,
  action,
  role,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  action: string;
  role?: string;
  label?: string;
}) {
  return (
    <form
      method="get"
      action={action}
      className={className}
      role={role}
      aria-label={label}
      onChange={(e) => {
        if ((e.target as HTMLElement).tagName === 'SELECT') e.currentTarget.requestSubmit();
      }}
    >
      {children}
    </form>
  );
}
