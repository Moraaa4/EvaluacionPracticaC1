import Link from 'next/link';

const reports = [
  { id: 1, name: 'Rendimiento por Curso', path: '/reports/performance', desc: 'Promedios y reprobados' },
  { id: 2, name: 'Carga Docente', path: '/reports/teacher-load', desc: 'Grupos y alumnos totales' },
  { id: 3, name: 'Alumnos en Riesgo', path: '/reports/at-risk', desc: 'Promedio < 7 o Asistencia < 80%' },
  { id: 4, name: 'Asistencia por Grupo', path: '/reports/attendance', desc: 'Promedio de asistencia' },
  { id: 5, name: 'Ranking de Alumnos', path: '/reports/ranking', desc: 'Top por carrera y periodo' },
];

export default function Dashboard() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Coordinación Académica</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Link key={report.id} href={report.path} className="block p-6 border rounded-lg hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">{report.name}</h2>
            <p className="text-gray-600">{report.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}