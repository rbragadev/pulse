const EVENTS = [
  { id: 1, title: 'Hackathon OTG', date: '15 Mai', icon: '⚡', type: 'Hackathon' },
  { id: 2, title: 'All Hands Meeting', date: '20 Mai', icon: '📢', type: 'Empresa' },
  { id: 3, title: 'Onboarding Junho', date: '2 Jun', icon: '🎓', type: 'Onboarding' },
  { id: 4, title: 'OTG Day', date: '21 Jun', icon: '🎊', type: 'Evento' },
];

export default function EventsWidget() {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
        <span>📅</span>
        Próximos Eventos
      </h3>
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
    </div>
  );
}
