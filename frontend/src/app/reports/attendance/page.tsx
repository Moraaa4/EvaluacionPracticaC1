import { query } from '@/lib/db';

export default async function AttendanceReport({ searchParams }: { searchParams: Promise<{ term?: string }> }) {
  const { term } = await searchParams;
  const data = await query(`SELECT * FROM vw_group_attendance WHERE term = $1`, [term || '2025-1']);
  const stats = data.rows;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Asistencia por Grupo</h1>
      <table className="w-full border-collapse border border-slate-700">
        <thead>
          {/* Encabezado */}
          <tr className="bg-slate-800 text-white">
            <th className="border border-slate-700 p-3 text-left">Curso</th>
            <th className="border border-slate-700 p-3 text-center">Asistencia Promedio</th>
          </tr>
        </thead>
        <tbody className="text-slate-300">
          {stats.map((row, i) => (
            <tr key={i} className="hover:bg-slate-800/30">
              <td className="border border-slate-700 p-3 text-left">{row.course_name}</td>
              <td className="border border-slate-700 p-3 text-center">
                {row.avg_attendance ? `${Number(row.avg_attendance).toFixed(2)}%` : '0%'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}