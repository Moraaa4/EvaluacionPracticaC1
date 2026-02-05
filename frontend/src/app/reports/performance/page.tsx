import { query } from '@/lib/db';
import { SearchSchema } from '@/lib/definitions';

export default async function PerformanceReport({ searchParams }: { searchParams: { term?: string } }) {
  // 1. Filtro obligatorio por periodo (term) [cite: 24]
  const { term } = SearchSchema.parse(searchParams);

  // 2. Consulta a la VIEW filtrada [cite: 16, 27]
  const data = await query(
    `SELECT * FROM vw_course_performance WHERE term = $1`,
    [term || '2025-1'] // Valor por defecto si no hay filtro
  );

  const stats = data.rows;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Rendimiento por Curso</h1>
      <p className="mb-6 text-gray-500 italic">Insight: Promedios generales y conteo de aprobación/reprobación por periodo [cite: 55]</p>

      {/* Selector de periodo (Filtro) [cite: 61] */}
      <form className="mb-6 flex gap-4">
        <select name="term" className="border p-2 rounded" defaultValue={term || '2025-1'}>
          <option value="2025-1">Periodo 2025-1</option>
          <option value="2025-2">Periodo 2025-2</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Filtrar</button>
      </form>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Curso</th>
            <th className="border p-2 text-left">Carrera</th>
            <th className="border p-2">Promedio</th>
            <th className="border p-2 text-green-600">Aprobados</th>
            <th className="border p-2 text-red-600">Reprobados</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((row, i) => (
            <tr key={i} className="text-center">
              <td className="border p-2 text-left">{row.course_name}</td>
              <td className="border p-2 text-left">{row.program}</td>
              <td className="border p-2 font-bold">{row.general_avg}</td>
              <td className="border p-2">{row.passed_count}</td>
              <td className="border p-2">{row.failed_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}