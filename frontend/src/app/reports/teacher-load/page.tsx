'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TeacherLoad } from '@/lib/definitions';

export default function TeacherLoadReport() {
  const [stats, setStats] = useState<TeacherLoad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const term = searchParams.get('term') || '2025-1';

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/reports/teacher-load?term=${term}`);
        const result = await response.json();

        if (!result.success) {
          setError(result.message || 'Error al cargar datos');
          return;
        }

        setStats(result.data);
      } catch (err) {
        setError('Error de conexión al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [term]);

  const handleTermChange = (newTerm: string) => {
    router.push(`/reports/teacher-load?term=${newTerm}`);
  };

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
      <h1 className="text-2xl font-bold mb-4 text-white">Carga Académica por Docente</h1>

      <form className="mb-6 flex gap-4" onSubmit={(e) => e.preventDefault()}>
        <select
          name="term"
          className="border p-2 rounded bg-slate-800 text-white"
          value={term}
          onChange={(e) => handleTermChange(e.target.value)}
        >
          <option value="2025-1">Periodo 2025-1</option>
          <option value="2025-2">Periodo 2025-2</option>
        </select>
      </form>

      {stats.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          No hay datos de carga docente disponibles para este periodo
        </div>
      ) : (
        <table className="w-full border-collapse border border-slate-700">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="border border-slate-700 p-3 text-left">Docente</th>
              <th className="border border-slate-700 p-3 text-center">Grupos</th>
              <th className="border border-slate-700 p-3 text-center">Total Alumnos</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {stats.map((row) => (
              <tr key={`${row.teacher_name}-${row.term}`} className="hover:bg-slate-800/40">
                <td className="border border-slate-700 p-3 text-left">{row.teacher_name}</td>
                <td className="border border-slate-700 p-3 text-center">{row.groups_count}</td>
                <td className="border border-slate-700 p-3 text-center">{row.total_students}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}