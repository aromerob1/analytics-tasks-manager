import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { Task } from "../types";

// Colores para las categorías de tareas
const CATEGORY_COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

// Función para calcular métricas
function calculateMetrics(tasks: Task[]) {
  const totalTasks = tasks?.length;
  const completedTasks = tasks?.filter(task => task.completedAt).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calcular tiempo promedio de completitud
  const completionTimes = tasks
    ?.filter(task => task.completedAt)
    .map(task => (new Date(task.completedAt!).getTime() - new Date(task.createdAt).getTime()) / (1000 * 60 * 60 * 24)); // Convertir a días
  const avgCompletionTime = completionTimes?.length ? (completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length).toFixed(1) : "N/A";

  // Contar tareas completadas por día de la semana
  const productivityByDay: Record<string, number> = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0 };
  tasks?.forEach(task => {
    if (task.completedAt) {
      const day = new Date(task.completedAt).toLocaleDateString("en-US", { weekday: "long" });
      productivityByDay[day] += 1;
    }
  });

  // Contar tareas por categoría
  const categoryCounts: Record<string, number> = {};
  tasks?.forEach(task => {
    if (task.category) {
      categoryCounts[task.category] = (categoryCounts[task.category] || 0) + 1;
    }
  });

  // Calcular tasa de abandono
  const abandonedTasks = tasks?.filter(task => task.deleted && !task.completedAt).length;
  const abandonmentRate = totalTasks > 0 ? Math.round((abandonedTasks / totalTasks) * 100) : 0;

  // Tareas completadas por semana (últimas 6 semanas)
  const weeklyData: Record<string, number> = {};
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const week = new Date(today);
    week.setDate(today.getDate() - i * 7);
    const weekLabel = `${week.getMonth() + 1}/${week.getDate()}`;
    weeklyData[weekLabel] = 0;
  }
  tasks?.forEach(task => {
    if (task.completedAt) {
      const week = new Date(task.completedAt);
      const weekLabel = `${week.getMonth() + 1}/${week.getDate()}`;
      if (weeklyData[weekLabel] !== undefined) {
        weeklyData[weekLabel] += 1;
      }
    }
  });

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completionRate,
    avgCompletionTime,
    productivityByDay: Object.entries(productivityByDay).map(([day, count]) => ({ day, count })),
    categoryCounts: Object.entries(categoryCounts).map(([category, count], index) => ({ category, count, color: CATEGORY_COLORS[index % CATEGORY_COLORS.length] })),
    abandonmentRate,
    weeklyTrends: Object.entries(weeklyData).map(([week, count]) => ({ week, count })),
  };
}

export default function AnalyticsPage({ tasks }: { tasks: Task[] }) {
  const {
    totalTasks,
    completedTasks,
    pendingTasks,
    completionRate,
    avgCompletionTime,
    productivityByDay,
    categoryCounts,
    abandonmentRate,
    weeklyTrends
  } = calculateMetrics(tasks);

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-lg font-semibold">Task Analytics</h2>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="p-4 bg-blue-100 rounded text-blue-900">
          <h3 className="text-lg">Total Tasks</h3>
          <p className="text-2xl font-bold">{'10'}</p>
        </div>

        <div className="p-4 bg-green-100 rounded text-green-900">
          <h3 className="text-lg">Completion Rate</h3>
          <p className="text-2xl font-bold">{'5'}%</p>
        </div>

        <div className="p-4 bg-yellow-100 rounded text-yellow-900">
          <h3 className="text-lg">Avg Completion Time</h3>
          <p className="text-2xl font-bold">{'1'} days</p>
        </div>
      </div>

      {/* Gráfico de productividad por día */}
      <h3 className="mt-6 text-lg font-semibold">Productivity by Day</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>

      {/* Pie chart de tareas por categoría */}
      <h3 className="mt-6 text-lg font-semibold">Tasks by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie dataKey="count" data={categoryCounts} cx="50%" cy="50%" outerRadius={100}>
            {categoryCounts.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Tasa de abandono */}
      <div className="p-4 mt-4 bg-red-100 rounded text-red-900">
        <h3 className="text-lg">Abandonment Rate</h3>
        <p className="text-2xl font-bold">{'5'}%</p>
      </div>

      {/* Tendencia de productividad */}
      <h3 className="mt-6 text-lg font-semibold">Productivity Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart>
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
