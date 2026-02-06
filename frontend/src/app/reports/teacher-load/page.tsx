import { query } from '@/lib/db';

export default async function TeacherLoadReport({ searchParams }: { searchParams: Promise<{ term?: string }> }) {
  const { term } = await searchParams;

  const data = await query(
    `SELECT * FROM vw_teacher_load WHERE term = $1`,
    [term || '2025-1']
  );

  const stats = data.rows;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Carga Académica por Docente</h1>
      <table className="w-full border-collapse border border-slate-700">
        <thead>
          {}
          <tr className="bg-slate-800 text-white">
            <th className="border border-slate-700 p-3 text-left">Docente</th>
            <th className="border border-slate-700 p-3 text-center">Grupos</th>
            <th className="border border-slate-700 p-3 text-center">Total Alumnos</th>
          </tr>
        </thead>
        <tbody className="text-slate-300">
          {stats.map((row, i) => (
            <tr key={i} className="hover:bg-slate-800/40">
              <td className="border border-slate-700 p-3 text-left">{row.teacher_name}</td>
              <td className="border border-slate-700 p-3 text-center">{row.groups_count}</td>
              <td className="border border-slate-700 p-3 text-center">{row.total_students}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}