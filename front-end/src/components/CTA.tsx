import React, { useState, useEffect, useRef } from 'react'
import { IconShieldCheck, IconArrowRight } from "@tabler/icons-react"
import { Link } from 'react-router-dom';

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

const CTA = () => {
    return (
        <section className="py-24 px-6 border-t border-border">
            <div className="max-w-2xl mx-auto text-center">
                <FadeIn>
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6 border"
                        style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
                    >
                        <IconShieldCheck size={12} />
                        No credit card. No setup.
                    </div>
                    <h2
                        className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5"
                        style={{ letterSpacing: "-0.03em" }}
                    >
                        Start collecting
                        <br />responses today.
                    </h2>
                    <p className="text-muted-foreground mb-8 text-base">
                        Create an account, build your first poll in under a minute, and share it — the rest takes care of itself.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                        Create free account
                        <IconArrowRight size={15} />
                    </Link>
                </FadeIn>
            </div>
        </section>
    );
}

export default CTA
