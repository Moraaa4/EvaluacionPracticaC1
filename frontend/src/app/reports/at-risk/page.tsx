import { query } from '@/lib/db';
import { StudentAtRisk, SearchSchema } from '@/lib/definitions';

export default async function AtRiskReport({ searchParams }: { searchParams: Promise<{ query?: string; page?: string }> }) {
  const resolvedParams = await searchParams;
  const { query: searchTerm, page, limit } = SearchSchema.parse(resolvedParams);
  const offset = (page - 1) * limit;

  const data = await query(
    `SELECT * FROM vw_students_at_risk 
     WHERE name ILIKE $1 OR email ILIKE $1 
     LIMIT $2 OFFSET $3`,
    [`%${searchTerm || ''}%`, limit, offset]
  );

  const students = data.rows as StudentAtRisk[];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Alumnos en Riesgo</h1>
      <div className="bg-red-900/40 border-l-4 border-red-500 p-4 mb-6 text-white font-bold">
        Total en riesgo detectados: {students.length}
      </div>

      <table className="w-full border-collapse border border-slate-700">
        <thead>
          {/* Encabezado */}
          <tr className="bg-slate-800 text-white">
            <th className="border border-slate-700 p-3 text-left">Nombre</th>
            <th className="border border-slate-700 p-3 text-left">Email</th>
            <th className="border border-slate-700 p-3 text-center">Promedio</th>
            <th className="border border-slate-700 p-3 text-center">Asistencia %</th>
          </tr>
        </thead>
        <tbody className="text-slate-300">
          {students.map((s, i) => (
            <tr key={i} className="hover:bg-slate-800/30">
              <td className="border border-slate-700 p-3 text-left">{s.name}</td>
              <td className="border border-slate-700 p-3 text-left">{s.email}</td>
              <td className="border border-slate-700 p-3 text-center text-red-500 font-bold">
                {s.avg_grade ? Number(s.avg_grade).toFixed(2) : '0.00'}
              </td>
              <td className="border border-slate-700 p-3 text-center">
                {s.att_rate ? `${Number(s.att_rate).toFixed(0)}%` : '0%'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}