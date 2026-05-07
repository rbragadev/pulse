const BIRTHDAYS = [
  { name: 'Fernanda Costa', initial: 'F', date: 'Hoje 🎂', dept: 'Marketing', color: '#f59e0b' },
  { name: 'Pedro Alves', initial: 'P', date: 'Amanhã', dept: 'Comercial', color: '#3b82f6' },
  { name: 'Mariana Dias', initial: 'M', date: 'Sáb, 10 Mai', dept: 'Produto', color: '#8b5cf6' },
  { name: 'Gustavo Pereira', initial: 'G', date: 'Dom, 11 Mai', dept: 'Tecnologia', color: '#6366f1' },
];

export default function BirthdaysWidget() {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
        <span>🎉</span>
        Aniversariantes da semana
      </h3>
      <div className="space-y-2.5">
        {BIRTHDAYS.map((b) => (
          <div key={b.name} className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ backgroundColor: `${b.color}90` }}
            >
              {b.initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{b.name}</p>
              <p className="text-[10px] text-muted-foreground">{b.dept}</p>
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0 text-right">{b.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
