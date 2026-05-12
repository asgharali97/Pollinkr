import React, { useRef, useState, useEffect } from 'react'

function useInView(ref: React.RefObject<Element>, threshold = 0.15) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setVisible(true);
                    obs.disconnect();
                }
            },
            { threshold },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return visible;
}

function FadeIn({
    children,
    delay = 0,
    className = "",
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null!);
    const visible = useInView(ref);
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(18px)",
                transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

const SocailProf = () => {
    const stats = [
        { value: "< 60s", label: "to create and share a poll" },
        { value: "Live", label: "response updates via WebSocket" },
        { value: "Zero", label: "friction for respondents" },
    ];

    return (
        <section className="py-20 px-6 border-t border-border">
            <div className="max-w-4xl mx-auto">
                <div className="grid sm:grid-cols-3 gap-px border border-border rounded-xl overflow-hidden">
                    {stats.map((s, i) => (
                        <FadeIn key={i} delay={i * 80}>
                            <div
                                className="p-8 text-center"
                                style={{ background: "hsl(var(--card))" }}
                            >
                                <p
                                    className="text-4xl font-semibold tracking-tight mb-2"
                                    style={{ letterSpacing: "-0.03em" }}
                                >
                                    {s.value}
                                </p>
                                <p className="text-sm text-muted-foreground">{s.label}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default SocailProf
