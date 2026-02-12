'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { StudentAtRisk } from '@/lib/definitions';
import Pagination from '@/components/Pagination';

export default function AtRiskReport() {
  const [students, setStudents] = useState<StudentAtRisk[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get('query') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/reports/at-risk?query=${query}&page=${page}&limit=${limit}`);
        const result = await response.json();

        if (!result.success) {
          setError(result.message || 'Error al cargar datos');
          return;
        }

        setStudents(result.data);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch (err) {
        setError('Error de conexión al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [query, page, limit]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    params.set('page', newPage.toString());
    params.set('limit', limit.toString());
    router.push(`/reports/at-risk?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="h-16 bg-red-900/40 rounded mb-6"></div>
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
      <h1 className="text-2xl font-bold mb-4 text-white">Alumnos en Riesgo</h1>
      <div className="bg-red-900/40 border-l-4 border-red-500 p-4 mb-6 text-white font-bold">
        Total en riesgo detectados: {total}
      </div>

      {students.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          {query ? 'No se encontraron alumnos en riesgo con ese criterio de búsqueda' : 'No hay alumnos en riesgo en este momento'}
        </div>
      ) : (
        <>
          <table className="w-full border-collapse border border-slate-700">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="border border-slate-700 p-3 text-left">Nombre</th>
                <th className="border border-slate-700 p-3 text-left">Email</th>
                <th className="border border-slate-700 p-3 text-center">Promedio</th>
                <th className="border border-slate-700 p-3 text-center">Asistencia %</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {students.map((s, i) => (
                <tr key={`${s.email}-${i}`} className="hover:bg-slate-800/30">
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

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}