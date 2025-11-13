import { Lead, Temperature, Objection, Message, CalendarEvent, ProjectResource } from './types';

export const INITIAL_LEADS: Lead[] = [
  {
    id: 1,
    name: 'Ana García',
    project: 'Vistas del Parque',
    temperature: Temperature.Warm,
    persona: 'Pareja joven, buscando su primer departamento. Valoran la luz natural, la seguridad y espacios para mascotas. Presupuesto moderado.',
    conversation: [
      { id: 1, sender: 'lead', text: 'Hola, vi el proyecto "Vistas del Parque" y me interesó mucho. ¿Podrían darme más información?', timestamp: '10:00 AM' },
      { id: 2, sender: 'agent', text: '¡Hola Ana! Claro que sí. "Vistas del Parque" es ideal para parejas jóvenes. ¿Qué es lo que más te llamó la atención?', timestamp: '10:02 AM' },
      { id: 3, sender: 'lead', text: 'Las áreas verdes y la ubicación. El espacio se ve bien en las fotos, pero me cuesta imaginar cómo quedarían mis muebles... Tengo un sofá en forma de L muy grande.', timestamp: '10:05 AM'}
    ],
    jobTitle: 'Diseñadora Gráfica',
    company: 'Creativos Asociados',
    phone: '+51 987 654 321',
    email: 'ana.garcia@email.com',
    stage: 'Calificado',
    owner: 'Agente Principal',
    tags: ['primer_hogar', 'diseño']
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    project: 'Residencial Céntrico',
    temperature: Temperature.Hot,
    persona: 'Inversionista experimentado. Busca propiedades con alta plusvalía y buen retorno de alquiler. Se enfoca en los números y datos duros.',
    conversation: [
      { id: 1, sender: 'lead', text: 'Información sobre Residencial Céntrico. Retorno de inversión estimado?', timestamp: 'Ayer' },
    ],
    jobTitle: 'Director de Inversiones',
    company: 'Capital Futuro',
    phone: '+51 912 345 678',
    email: 'carlos.r@email.com',
    stage: 'Negociación',
    owner: 'Agente Principal',
    tags: ['inversionista', 'alta_rentabilidad']
  },
  {
    id: 3,
    name: 'Sofía Martinez',
    project: 'Loft Urbano',
    temperature: Temperature.Cold,
    persona: 'Profesional soltera. Busca un espacio moderno y bien conectado. Es muy sensible al precio y ya ha visto otras 5 opciones.',
    conversation: [
      { id: 1, sender: 'lead', text: 'Me gustó el Loft, pero el precio me parece un poco alto.', timestamp: 'Hace 2 días' },
    ],
    jobTitle: 'Analista de Marketing',
    company: 'Tech Solutions',
    phone: '+51 998 877 665',
    email: 'sofia.m@email.com',
    stage: 'Contactado',
    owner: 'Agente Principal',
    tags: ['sensible_al_precio', 'loft']
  },
  {
    id: 4,
    name: 'Mateo Quispe',
    project: 'Terrazas de San Borja',
    temperature: Temperature.Hot,
    persona: 'Familia joven con un hijo pequeño. Buscan seguridad, parques cercanos y un departamento de 3 dormitorios.',
    conversation: [
        { id: 1, sender: 'lead', text: 'Hola, ¿el proyecto en San Borja tiene áreas de juegos para niños?', timestamp: '11:30 AM' }
    ],
    email: 'mateo.quispe@email.com',
    stage: 'Propuesta',
    tags: ['familia', '3_dormitorios']
  },
  {
    id: 5,
    name: 'Camila Flores',
    project: 'Miraflores Oceanic',
    temperature: Temperature.Warm,
    persona: 'Profesional joven, trabaja desde casa. Valora una buena conexión a internet, un espacio para oficina y vista al mar.',
    conversation: [
        { id: 1, sender: 'lead', text: '¿Los departamentos en Miraflores tienen balcón?', timestamp: '02:15 PM' }
    ],
    email: 'camila.f@email.com',
    stage: 'Calificado',
    tags: ['home_office', 'vista_al_mar']
  },
  {
    id: 6,
    name: 'Santiago Rojas',
    project: 'Altos de La Molina',
    temperature: Temperature.Cold,
    persona: 'Busca una casa grande con jardín. Su presupuesto es limitado y está preocupado por el tráfico de la zona.',
    conversation: [
        { id: 1, sender: 'lead', text: 'El precio por metro cuadrado en La Molina es negociable?', timestamp: 'Hace 3 días' }
    ],
    email: 'santiago.rojas@email.com',
    stage: 'Contactado',
    tags: ['presupuesto_ajustado', 'casa_con_jardin']
  },
  {
    id: 7,
    name: 'Luciana Mendoza',
    project: 'Barranco Bohemio Lofts',
    temperature: Temperature.Hot,
    persona: 'Artista plástica. Busca un espacio con mucha luz, techos altos y un ambiente inspirador cerca de galerías de arte.',
    conversation: [
        { id: 1, sender: 'lead', text: '¡Me encanta! ¿Cuándo puedo visitar el loft piloto?', timestamp: '09:00 AM' }
    ],
    email: 'luciana.m@email.com',
    stage: 'Negociación',
    tags: ['artista', 'techos_altos']
  },
  {
    id: 8,
    name: 'Nicolás Castillo',
    project: 'San Isidro Golf Suites',
    temperature: Temperature.Hot,
    persona: 'Empresario, busca un pied-à-terre de lujo para sus viajes de negocios a Lima. Valora la exclusividad y los acabados premium.',
    conversation: [
        { id: 1, sender: 'lead', text: 'Enviar catálogo de acabados y especificaciones técnicas.', timestamp: 'Ayer' }
    ],
    email: 'nicolas.castillo@email.com',
    stage: 'Propuesta',
    tags: ['lujo', 'inversionista_extranjero']
  },
  {
    id: 9,
    name: 'Valentina Torres',
    project: 'Parque Surco Living',
    temperature: Temperature.Warm,
    persona: 'Pareja de recién casados. Buscan un lugar tranquilo, con buena distribución y cerca al trabajo de ambos.',
    conversation: [
        { id: 1, sender: 'lead', text: '¿Qué opciones de financiamiento ofrecen?', timestamp: '04:00 PM' }
    ],
    email: 'valentina.t@email.com',
    stage: 'Calificado',
    tags: ['recien_casados', 'tranquilidad']
  },
  {
    id: 10,
    name: 'Sebastián Soto',
    project: 'Lince Moderno',
    temperature: Temperature.Cold,
    persona: 'Joven profesional, muy analítico. Ha comparado 10 proyectos y busca la mejor oferta en relación calidad-precio.',
    conversation: [
        { id: 1, sender: 'lead', text: 'Tengo una mejor oferta de otro proyecto. ¿Pueden igualarla?', timestamp: 'Hace 5 días' }
    ],
    email: 'sebastian.soto@email.com',
    stage: 'Contactado',
    tags: ['analitico', 'sensible_al_precio']
  },
  {
    id: 11,
    name: 'Isabella Vargas',
    project: 'Pueblo Libre Tradición',
    temperature: Temperature.Warm,
    persona: 'Busca un departamento para sus padres mayores. Prioriza la accesibilidad, primer piso y cercanía a clínicas y mercados.',
    conversation: [
        { id: 1, sender: 'lead', text: '¿El edificio cuenta con rampas y ascensores anchos?', timestamp: '01:20 PM' }
    ],
    email: 'isabella.v@email.com',
    stage: 'Calificado',
    tags: ['tercera_edad', 'accesibilidad']
  },
  {
    id: 12,
    name: 'Alejandro Romero',
    project: 'Magdalena del Mar Premium',
    temperature: Temperature.Hot,
    persona: 'Expatriado que regresa a Perú. Busca un departamento moderno, seguro y con amenidades como gimnasio y piscina.',
    conversation: [
        { id: 1, sender: 'lead', text: 'Perfecto, agendemos una videollamada para ver los planos.', timestamp: '10:45 AM' }
    ],
    email: 'alejandro.r@email.com',
    stage: 'Propuesta',
    tags: ['expatriado', 'amenidades']
  },
  {
    id: 13,
    name: 'Valeria Chávez',
    project: 'Jesús María Conecta',
    temperature: Temperature.Warm,
    persona: 'Estudiante universitaria. Sus padres le comprarán un departamento. Busca algo cerca de su universidad y de zonas comerciales.',
    conversation: [
        { id: 1, sender: 'lead', text: '¿A cuántas cuadras está del Real Plaza Salaverry?', timestamp: '06:00 PM' }
    ],
    email: 'valeria.chavez@email.com',
    stage: 'Calificado',
    tags: ['estudiante', 'inversion_familiar']
  },
  {
    id: 14,
    name: 'Diego Paredes',
    project: 'Chorrillos Costa Verde',
    temperature: Temperature.Cold,
    persona: 'Amante del surf. Quiere vivir cerca a la playa pero no está seguro si Chorrillos es la mejor opción para él.',
    conversation: [
        { id: 1, sender: 'lead', text: 'He escuchado que el tráfico por ahí es complicado.', timestamp: 'Hace 1 semana' }
    ],
    email: 'diego.p@email.com',
    stage: 'Contactado',
    tags: ['surfista', 'dudas_ubicacion']
  },
  {
    id: 15,
    name: 'Sofía Díaz',
    project: 'San Miguel Parkside',
    temperature: Temperature.Warm,
    persona: 'Joven profesional que busca independizarse. Presupuesto limitado, busca un departamento pequeño pero funcional y bien ubicado.',
    conversation: [
        { id: 1, sender: 'lead', text: '¿Cuál es el departamento más económico que tienen disponible?', timestamp: '12:00 PM' }
    ],
    email: 'sofia.diaz@email.com',
    stage: 'Calificado',
    tags: ['primer_hogar', 'presupuesto_limitado']
  },
  {
    id: 16,
    name: 'Gabriel Herrera',
    project: 'Residencial San Luis',
    temperature: Temperature.Hot,
    persona: 'Pequeño empresario que busca invertir sus ahorros en un inmueble para alquilar. Se enfoca en la rentabilidad.',
    conversation: [
        { id: 1, sender: 'lead', text: '¿Cuál es el precio promedio de alquiler en la zona para un dpto de 2 habitaciones?', timestamp: 'Ayer' }
    ],
    email: 'gabriel.h@email.com',
    stage: 'Propuesta',
    tags: ['inversionista', 'rentabilidad_alquiler']
  },
  {
    id: 17,
    name: 'Andrea Guzmán',
    project: 'Ate Vitarte Futuro',
    temperature: Temperature.Cold,
    persona: 'Familia en crecimiento. Buscan una opción económica con potencial de crecimiento a futuro, aunque esté más alejado.',
    conversation: [
        { id: 1, sender: 'lead', text: 'Estamos viendo opciones, aún no nos decidimos. Gracias.', timestamp: 'Hace 4 días' }
    ],
    email: 'andrea.guzman@email.com',
    stage: 'Contactado',
    tags: ['familia_joven', 'buscando_precio']
  },
  {
    id: 18,
    name: 'José Fernández',
    project: 'El Agustino Mirador',
    temperature: Temperature.Warm,
    persona: 'Obrero calificado buscando acceder a un crédito de vivienda social. Necesita asesoría con los trámites.',
    conversation: [
        { id: 1, sender: 'lead', text: '¿Ustedes ayudan con el trámite del crédito MiVivienda?', timestamp: '03:30 PM' }
    ],
    email: 'jose.fernandez@email.com',
    stage: 'Calificado',
    tags: ['credito_social', 'asesoria']
  }
];

export const INITIAL_EVENTS: CalendarEvent[] = [
    {
        id: 1,
        date: new Date(new Date().getFullYear(), 5, 22), // June 22
        title: 'Día de Puertas Abiertas',
        description: 'Proyecto "Vistas del Parque"',
        time: '10:00 AM - 4:00 PM',
    },
    {
        id: 2,
        date: new Date(new Date().getFullYear(), 5, 24), // June 24
        title: 'Reunión Semanal de Equipo',
        description: 'Oficina central',
        time: '9:00 AM',
    },
    {
        id: 3,
        date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3),
        title: 'Firma de Contrato - Familia López',
        description: 'Notaría Pública No. 12',
        time: '11:30 AM'
    },
    {
        id: 4,
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        title: 'Cierre de Metas Mensuales',
        description: 'Revisión de KPIs del equipo',
        time: '5:00 PM'
    }
];

export const INITIAL_OBJECTIONS: Objection[] = [
  {
    id: 1,
    title: 'Precio elevado',
    arguments: [
      'Entiendo tu perspectiva. Hablemos del valor a largo plazo y la plusvalía de la zona, que ha crecido un 15% anual.',
      'Si comparamos los acabados y amenidades con otros proyectos, verás que nuestra relación calidad-precio es superior.',
      'Podemos explorar diferentes esquemas de financiamiento que pueden hacer la mensualidad mucho más cómoda para ti.'
    ]
  },
  {
    id: 2,
    title: 'Espacio pequeño',
    arguments: [
      'La clave está en la distribución inteligente. Cada metro cuadrado está diseñado para ser funcional y versátil. ¿Viste el área de almacenamiento integrada?',
      'Muchos de nuestros clientes se sorprenden de lo espacioso que se siente una vez amueblado. Podemos usar el "Visualizador de Sueños" para que te hagas una idea.',
      'El diseño de doble altura y los ventanales amplios crean una sensación de amplitud mucho mayor al metraje real.'
    ]
  },
  {
    id: 3,
    title: 'Competencia cercana',
    arguments: [
        'Es cierto, hay más opciones, lo cual valida que esta es una excelente zona para invertir. Sin embargo, nuestro proyecto es el único con certificación LEED, lo que reduce costos de mantenimiento.',
        'A diferencia de otros, nosotros ofrecemos 2 años de mantenimiento incluido y acceso exclusivo al club deportivo. Es un paquete de valor completo.',
    ]
  }
];

export const INITIAL_RESOURCES: ProjectResource[] = [
  { id: 1, project: 'Vistas del Parque', name: 'Carpeta Principal', url: 'https://drive.google.com', type: 'folder' },
  { id: 2, project: 'Vistas del Parque', name: 'Brochure Oficial 2024.pdf', url: 'https://drive.google.com', type: 'pdf' },
  { id: 3, project: 'Vistas del Parque', name: 'Lista de Precios Q3.xlsx', url: 'https://drive.google.com', type: 'xlsx' },
  { id: 4, project: 'Residencial Céntrico', name: 'Carpeta Principal', url: 'https://drive.google.com', type: 'folder' },
  { id: 5, project: 'Residencial Céntrico', name: 'Análisis de Rentabilidad.pdf', url: 'https://drive.google.com', type: 'pdf' },
  { id: 6, project: 'Loft Urbano', name: 'Carpeta Principal', url: 'https://drive.google.com', type: 'folder' },
  { id: 7, project: 'Loft Urbano', name: 'Comparativa de Mercado.docx', url: 'https://drive.google.com', type: 'docx' },
  { id: 8, project: 'Loft Urbano', name: 'Planos y Acabados.pdf', url: 'https://drive.google.com', type: 'pdf' },
  { id: 9, project: 'Terrazas de San Borja', name: 'Brochure Familias.pdf', url: 'https://drive.google.com', type: 'pdf' },
  { id: 10, project: 'Miraflores Oceanic', name: 'Vistas y Planos.pdf', url: 'https://drive.google.com', type: 'pdf' },
  { id: 11, project: 'Barranco Bohemio Lofts', name: 'Carpeta de Arte y Diseño.pdf', url: 'https://drive.google.com', type: 'pdf' },
  { id: 12, project: 'San Isidro Golf Suites', name: 'Catálogo de Lujo.pdf', url: 'https://drive.google.com', type: 'pdf' },
];