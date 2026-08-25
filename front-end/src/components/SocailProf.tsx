const SocailProf = () => {
  const stats = [
    { value: "< 60s", label: "to create and share a poll" },
    { value: "Live", label: "response updates via WebSocket" },
    { value: "Zero", label: "friction for respondents" },
  ];

  return (
    <section className="py-12 px-6 border-t border-border border-dashed">
      <div className="max-w-4xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-px">
          {stats.map((s, i) => (
              <div
                className={`text-center ${i < 2 ? "border-r" : ""}`}
                key={i}
              >
                <h4
                  className="text-3xl font-bold tracking-tight mb-1 text-foreground/90"
                >
                  {s.value}
                </h4>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocailProf;
