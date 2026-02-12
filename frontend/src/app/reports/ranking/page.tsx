'use client';

import { useState, useEffect } from 'react';
import { StudentRanking } from '@/lib/definitions';

export default function RankingReport() {
  const [students, setStudents] = useState<StudentRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/reports/ranking?limit=10');
        const result = await response.json();

        if (!result.success) {
          setError(result.message || 'Error al cargar datos');
          return;
        }

        setStudents(result.data);
      } catch (err) {
        setError('Error de conexión al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-900/40 border-l-4 border-red-500 p-4 text-white">
          <h2 className="font-bold text-lg mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Top 10 Alumnos (Ranking)</h1>

      {students.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          No hay datos de ranking disponibles
        </div>
      ) : (
        <table className="w-full border-collapse border border-slate-700">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="border border-slate-700 p-3 text-center">Posición</th>
              <th className="border border-slate-700 p-3 text-left">Alumno</th>
              <th className="border border-slate-700 p-3 text-left">Carrera</th>
              <th className="border border-slate-700 p-3 text-center">Promedio (Score)</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {students.map((s) => (
              <tr key={`${s.student_name}-${s.program}-${s.term}-${s.position}`} className="hover:bg-slate-800/30">
                <td className="border border-slate-700 p-3 text-center">
                  <span className={`font-bold ${s.position === 1 ? 'text-yellow-400' : s.position === 2 ? 'text-gray-300' : s.position === 3 ? 'text-orange-400' : 'text-slate-400'}`}>
                    #{s.position}
                  </span>
                </td>
                <td className="border border-slate-700 p-3 text-left">{s.student_name}</td>
                <td className="border border-slate-700 p-3 text-left">{s.program}</td>
                <td className="border border-slate-700 p-3 text-center font-bold text-yellow-500">
                  {s.score ? Number(s.score).toFixed(2) : '0.00'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}