'use client';

export function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#274126]">{title}</h2>
            {subtitle ? <p className="mt-2 text-[#486449]">{subtitle}</p> : null}
          </div>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

