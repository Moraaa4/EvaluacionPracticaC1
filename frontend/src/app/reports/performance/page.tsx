'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CoursePerformance } from '@/lib/definitions';

export default function PerformanceReport() {
  const [stats, setStats] = useState<CoursePerformance[]>([]);
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
        const response = await fetch(`/api/reports/performance?term=${term}`);
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
    router.push(`/reports/performance?term=${newTerm}`);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-slate-700 rounded w-2/3 mb-6"></div>
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
      <h1 className="text-2xl font-bold mb-4 text-white">Rendimiento por Curso</h1>
      <p className="mb-6 text-gray-400 italic">Insight: Promedios generales y conteo de aprobación/reprobación por periodo</p>

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
          No hay datos disponibles para este periodo
        </div>
      ) : (
        <table className="w-full border-collapse border border-slate-700">
          <thead>
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
              <tr key={`${row.course_name}-${row.program}-${row.term}`} className="hover:bg-slate-800/40">
                <td className="border border-slate-700 p-3 text-left">{row.course_name}</td>
                <td className="border border-slate-700 p-3 text-left">{row.program}</td>
                <td className="border border-slate-700 p-3 text-center font-bold">{Number(row.general_avg).toFixed(2)}</td>
                <td className="border border-slate-700 p-3 text-center">{row.passed_count}</td>
                <td className="border border-slate-700 p-3 text-center">{row.failed_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}