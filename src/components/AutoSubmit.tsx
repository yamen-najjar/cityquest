'use client';

/** A GET form that applies itself when a select changes. Without JavaScript the submit button still works. */
export function AutoSubmitForm({ children, className, action }: { children: React.ReactNode; className?: string; action: string }) {
  return (
    <form
      method="get"
      action={action}
      className={className}
      onChange={(e) => {
        if ((e.target as HTMLElement).tagName === 'SELECT') e.currentTarget.requestSubmit();
      }}
    >
      {children}
    </form>
  );
}
