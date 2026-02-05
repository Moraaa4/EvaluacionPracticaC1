import { query } from '@/lib/db';
import { StudentAtRisk, SearchSchema } from '@/lib/definitions';

export default async function AtRiskReport({ searchParams }: { searchParams: { query?: string; page?: string } }) {
  // 1. Validar parámetros con Zod [cite: 61]
  const { query: searchTerm, page, limit } = SearchSchema.parse(searchParams);
  const offset = (page - 1) * limit;

  // 2. Consulta Server-Side (Solo SELECT a la VIEW) [cite: 27, 57]
  const data = await query(
    `SELECT * FROM vw_students_at_risk 
     WHERE name ILIKE $1 OR email ILIKE $1 
     LIMIT $2 OFFSET $3`,
    [`%${searchTerm || ''}%`, limit, offset]
  );

  const students = data.rows as StudentAtRisk[];
  const totalRisk = students.length; // KPI Destacado [cite: 55]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Alumnos en Riesgo</h1>
      <p className="mb-6 text-gray-500 italic">Insight: Estudiantes con promedio menor a 7.0 o asistencia bajo el 80%</p>

      {/* KPI Destacado [cite: 55] */}
      <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
        <p className="text-red-700 font-bold">Total en riesgo detectados: {totalRisk}</p>
      </div>

      {/* Tabla de Resultados [cite: 55] */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Promedio</th>
            <th className="border p-2">Asistencia %</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={i} className="text-center">
              <td className="border p-2">{s.name}</td>
              <td className="border p-2">{s.email}</td>
              <td className="border p-2 text-red-600 font-semibold">{s.avg_grade}</td>
              <td className="border p-2">{s.att_rate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}