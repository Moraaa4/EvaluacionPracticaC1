import { query } from '@/lib/db';

export default async function RankingReport() {
  const data = await query(`SELECT * FROM vw_student_ranking LIMIT 10`);
  const students = data.rows;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Top 10 Alumnos (Ranking)</h1>
      <table className="w-full border-collapse border border-slate-700">
        <thead>
          {/* Encabezado */}
          <tr className="bg-slate-800 text-white">
            <th className="border border-slate-700 p-3 text-left">Alumno</th>
            <th className="border border-slate-700 p-3 text-left">Carrera</th>
            <th className="border border-slate-700 p-3 text-center">Promedio (Score)</th>
          </tr>
        </thead>
        <tbody className="text-slate-300">
          {students.map((s, i) => (
            <tr key={i} className="hover:bg-slate-800/30">
              <td className="border border-slate-700 p-3 text-left">{s.student_name}</td>
              <td className="border border-slate-700 p-3 text-left">{s.program}</td>
              <td className="border border-slate-700 p-3 text-center font-bold text-yellow-500">
                {s.score ? Number(s.score).toFixed(2) : '0.00'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}