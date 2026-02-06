import { query } from '@/lib/db';
import { SearchSchema } from '@/lib/definitions';

export default async function PerformanceReport({ searchParams }: { searchParams: Promise<{ term?: string }> }) {
  const resolvedParams = await searchParams;
  const { term } = SearchSchema.parse(resolvedParams);

  const data = await query(
    `SELECT * FROM vw_course_performance WHERE term = $1`,
    [term || '2025-1']
  );

  const stats = data.rows;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Rendimiento por Curso</h1>
      <p className="mb-6 text-gray-400 italic">Insight: Promedios generales y conteo de aprobación/reprobación por periodo</p>

      <form className="mb-6 flex gap-4">
        <select name="term" className="border p-2 rounded bg-slate-800 text-white" defaultValue={term || '2025-1'}>
          <option value="2025-1">Periodo 2025-1</option>
          <option value="2025-2">Periodo 2025-2</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Filtrar</button>
      </form>

      <table className="w-full border-collapse border border-slate-700">
        <thead>
          {}
          <tr className="bg-slate-800 text-white">
            <th className="border border-slate-700 p-3 text-left">Curso</th>
            <th className="border border-slate-700 p-3 text-left">Carrera</th>
            <th className="border border-slate-700 p-3 text-center">Promedio</th>
            <th className="border border-slate-700 p-3 text-center text-green-400">Aprobados</th>
            <th className="border border-slate-700 p-3 text-center text-red-400">Reprobados</th>
          </tr>
        </thead>
        <tbody className="text-slate-300">
          {stats.map((row, i) => (
            <tr key={i} className="hover:bg-slate-800/40">
              <td className="border border-slate-700 p-3 text-left">{row.course_name}</td>
              <td className="border border-slate-700 p-3 text-left">{row.program}</td>
              <td className="border border-slate-700 p-3 text-center font-bold">{Number(row.general_avg).toFixed(2)}</td>
              <td className="border border-slate-700 p-3 text-center">{row.passed_count}</td>
              <td className="border border-slate-700 p-3 text-center">{row.failed_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}