const EVENTS = [
  { id: 1, title: 'Hackathon OTG', date: '15 Mai', icon: '⚡', type: 'Hackathon' },
  { id: 2, title: 'All Hands Meeting', date: '20 Mai', icon: '📢', type: 'Empresa' },
  { id: 3, title: 'Onboarding Junho', date: '2 Jun', icon: '🎓', type: 'Onboarding' },
  { id: 4, title: 'OTG Day', date: '21 Jun', icon: '🎊', type: 'Evento' },
];

export default function EventsWidget() {
  return (
    <div className="bg-card border border-border rounded-xl p-4 opacity-60">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <span>📅</span><span>Próximos Eventos</span>
        </h3>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border font-medium">
          Preview
        </span>
      </div>
      <div className="space-y-2.5">
        {EVENTS.map((e) => (
          <div key={e.id} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-base shrink-0">
              {e.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{e.title}</p>
              <p className="text-[10px] text-muted-foreground">{e.type}</p>
            </div>
            <span className="text-[10px] font-semibold text-primary shrink-0">{e.date}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground text-center mt-3 pt-2.5 border-t border-border/50">
        Dados reais após modelo Event ser implementado
      </p>
    </div>
  );
}
