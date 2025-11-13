import React, { useState } from 'react';
import { INITIAL_EVENTS } from '../../constants';
import CalendarView from './CalendarView';
import { MobiState, ProjectResource } from '../../types';

const Card: React.FC<{title: string, children: React.ReactNode, className?: string, onClick?: () => void}> = ({title, children, className, onClick}) => (
    <div className={`bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-md border border-black/10 ${className} ${onClick ? 'cursor-pointer hover:shadow-xl transition-shadow duration-300' : ''}`} onClick={onClick}>
        <h2 className="text-2xl font-bold text-[#0d624e] mb-4">{title}</h2>
        {children}
    </div>
);

const ResourceIcon: React.FC<{ type: ProjectResource['type'] }> = ({ type }) => {
    const icons = {
        pdf: '📄',
        folder: '📁',
        xlsx: '📊',
        docx: '📝'
    };
    return <span className="mr-2">{icons[type] || '📎'}</span>;
};

interface BlackboardViewProps {
  mobiState: MobiState;
}

const BlackboardView: React.FC<BlackboardViewProps> = ({ mobiState }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const upcomingEvents = INITIAL_EVENTS
    .filter(e => e.date >= new Date(new Date().setDate(new Date().getDate() - 1))) // from yesterday onwards
    .sort((a,b) => a.date.getTime() - b.date.getTime())
    .slice(0, 2);

  // FIX: Refactored resource grouping to use a forEach loop for better type inference.
  const resourcesByProject: Record<string, ProjectResource[]> = {};
  mobiState.resources.forEach((resource) => {
    if (!resourcesByProject[resource.project]) {
      resourcesByProject[resource.project] = [];
    }
    resourcesByProject[resource.project].push(resource);
  });

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-black">Blackboard de la Inmobiliaria</h1>
        <p className="text-black/70 mt-1">El centro neurálgico de tu equipo.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Tablón de Anuncios">
            <div className="space-y-4">
                <div className="bg-[#f29100]/20 p-4 rounded-lg">
                    <h3 className="font-bold text-[#f29100]">¡NUEVO ARGUMENTO DE VENTA!</h3>
                    <p className="text-black/80">Se ha aprobado la construcción de un nuevo centro comercial a 5 minutos de 'Vistas del Parque'. ¡Usen esto como argumento de plusvalía y conveniencia!</p>
                </div>
                 <div className="bg-black/5 p-4 rounded-lg">
                    <h3 className="font-bold text-black">Recordatorio Capacitación</h3>
                    <p className="text-black/80">Este viernes a las 9am tendremos la capacitación sobre nuevas técnicas de cierre con el coach internacional. ¡No falten!</p>
                </div>
            </div>
          </Card>
          <Card title="KPIs del Equipo (Mensual)">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-4xl font-bold text-[#ff5500]">42</p>
                    <p className="text-black/70">Citas Generadas</p>
                </div>
                <div>
                    <p className="text-4xl font-bold text-[#ff5500]">12%</p>
                    <p className="text-black/70">Tasa de Cierre</p>
                </div>
                <div>
                    <p className="text-4xl font-bold text-[#ff5500]">€1.2M</p>
                    <p className="text-black/70">Volumen de Ventas</p>
                </div>
            </div>
          </Card>
          <Card title="Recursos para Proyectos">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(resourcesByProject).map(([project, resources]) => (
                <div key={project}>
                  <h3 className="font-bold text-black mb-2 border-b border-black/10 pb-1">{project}</h3>
                  <ul className="space-y-2">
                    {resources.map(res => (
                       <li key={res.id}>
                          <a href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-black/90 hover:text-[#ff5500] cursor-pointer transition-colors text-sm">
                            <ResourceIcon type={res.type} />
                            {res.name}
                          </a>
                       </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Columna Derecha */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="Calendario de Eventos" onClick={() => setIsCalendarOpen(true)}>
            <ul className="space-y-3">
              {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                <li key={event.id} className="flex items-start">
                    <div className="bg-[#0d624e] text-white text-center rounded-md p-2 mr-4 min-w-[56px]">
                        <p className="text-xs uppercase">{event.date.toLocaleString('es-ES', { weekday: 'short' }).substring(0,3)}</p>
                        <p className="font-bold text-lg">{event.date.getDate()}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">{event.title}</h4>
                        <p className="text-sm text-black/70">{event.description}</p>
                        <p className="text-xs text-black/50">{event.time}</p>
                    </div>
                </li>
              )) : (
                <p className="text-black/60 text-sm">No hay eventos próximos.</p>
              )}
            </ul>
          </Card>
        </div>
      </div>
      {isCalendarOpen && <CalendarView events={INITIAL_EVENTS} onClose={() => setIsCalendarOpen(false)} />}
    </div>
  );
};

export default BlackboardView;