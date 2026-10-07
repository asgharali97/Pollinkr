const SocailProf = () => {
  const stats = [
    { value: "< 60s", label: "to create and share a poll" },
    { value: "Live", label: "response updates via WebSocket" },
    { value: "Zero", label: "friction for respondents" },
  ];

  return (
    <section className="flex border-t border-b border-dashed border-border py-12 px-6 justify-center">
      <div className="max-w-xl sm:max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-fit">
          {stats.map((s, i) => (
            <div
              className="bg-card shadow-card py-2 px-4 rounded-xl text-center"
              key={i}
            >
              <h4 className="text-2xl font-semibold tracking-tight mb-1 text-foreground/90">
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
