import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Task } from '../types';
import { useEffect, useState } from 'react';
import { getTasksByUser, getUserAnalytics } from '../services/TaskService';
import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function AnalyticsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const [showProductivityByDay, setShowProductivityByDay] = useState(true);
  const [showCategoryChart, setShowCategoryChart] = useState(true);
  const [showAbandonment, setShowAbandonment] = useState(true);
  const [showWeeklyTrends, setShowWeeklyTrends] = useState(true);

  useEffect(() => {
    getTasksByUser()
      .then((data) => {
        setTasks(data);
        setLoadingTasks(false);
      })
      .catch((error) => {
        console.error('Error fetching tasks for analytics:', error);
        setLoadingTasks(false);
      });
  }, []);

  useEffect(() => {
    if (!loadingTasks) {
      getUserAnalytics(tasks)
        .then((data) => {
          setAnalytics(data);
          setLoadingAnalytics(false);
        })
        .catch((err) => {
          console.error('Error fetching analytics:', err);
          setLoadingAnalytics(false);
        });
    }
  }, [loadingTasks, tasks]);

  if (loadingTasks || loadingAnalytics) {
    return (
      <div className="p-6 bg-white rounded shadow">Loading analytics...</div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6 bg-white rounded shadow">No analytics data found</div>
    );
  }

  const {
    totalTasks,
    abandonedTasks,
    completedTasks,
    pendingTasks,
    completionRate,
    avgCompletionTime,
    abandonmentRate,
    categoryCounts,
    productivityByDay,
    weeklyTrends,
    predictedTimeByCategory,
  } = analytics;

  const exportMetricsJSON = () => {
    const metrics = {
      totalTasks,
      abandonedTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      avgCompletionTime,
      abandonmentRate,
      categoryCounts,
      productivityByDay,
      weeklyTrends,
      predictedTimeByCategory,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(metrics, null, 2)
    )}`;

    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'metrics_report.json';
    link.click();
  };

  const exportMetricsCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    csvContent += 'Metric,Value\n';

    csvContent += `Total Tasks,${totalTasks}\n`;
    csvContent += `Abandoned Tasks,${abandonedTasks}\n`;
    csvContent += `Completed Tasks,${completedTasks}\n`;
    csvContent += `Pending Tasks,${pendingTasks}\n`;
    csvContent += `Completion Rate,${completionRate}%\n`;
    csvContent += `Avg Completion Time,${avgCompletionTime} hours\n`;
    csvContent += `Abandonment Rate,${abandonmentRate}%\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = 'metrics_report.csv';
    link.click();
  };

  const exportTasksCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    csvContent +=
      'id,description,status,category,createdAt,completedAt,deletedAt\n';

    tasks.forEach((t) => {
      csvContent += `${t.id},"${t.description}",${t.status},${t.category},${t.createdAt},${
        t.completedAt ?? ''
      },${t.deletedAt ?? ''}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = 'tasks_report.csv';
    link.click();
  };

  const exportTasksJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(tasks, null, 2)
    )}`;

    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'tasks_report.json';
    link.click();
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-lg font-semibold">Task Analytics</h2>

      {/* Buttons: Export, Toggles, etc. */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          onClick={exportMetricsJSON}
        >
          Export Metrics (JSON)
        </button>
        <button
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          onClick={exportMetricsCSV}
        >
          Export Metrics (CSV)
        </button>
        <button
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          onClick={exportTasksCSV}
        >
          Export Tasks (CSV)
        </button>
        <button
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          onClick={exportTasksJSON}
        >
          Export Tasks (JSON)
        </button>

        {/* Toggles */}
        <div className="flex sm:flex-row sm:items-center justify-between w-full">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-1"
              checked={showProductivityByDay}
              onChange={() => setShowProductivityByDay(!showProductivityByDay)}
            />
            Productivity by Day
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-1"
              checked={showCategoryChart}
              onChange={() => setShowCategoryChart(!showCategoryChart)}
            />
            Tasks by Category
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-1"
              checked={showAbandonment}
              onChange={() => setShowAbandonment(!showAbandonment)}
            />
            Abandonment Rate
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-1"
              checked={showWeeklyTrends}
              onChange={() => setShowWeeklyTrends(!showWeeklyTrends)}
            />
            Weekly Productivity Trends
          </label>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="p-4 bg-blue-100 rounded text-blue-900">
          <h3 className="text-lg">Total Tasks</h3>
          <p className="text-2xl font-bold">{totalTasks}</p>
        </div>
        <div className="p-4 bg-green-100 rounded text-green-900">
          <h3 className="text-lg">Completion Rate</h3>
          <p className="text-2xl font-bold flex items-center">
            {completionRate}% <CheckIcon className="w-6 h-6 ml-2" />{' '}
            {completedTasks} <ClockIcon className="w-6 h-6 ml-3" />{' '}
            {pendingTasks}
          </p>
        </div>
        <div className="p-4 bg-yellow-100 rounded text-yellow-900">
          <h3 className="text-lg">Avg Completion Time</h3>
          <p className="text-2xl font-bold">{avgCompletionTime} hours</p>
        </div>
      </div>

      {/* Productivity by Day (conditional) */}
      {showProductivityByDay && (
        <>
          <h3 className="mt-6 text-lg font-semibold">Productivity by Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productivityByDay}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      {/* Pie chart by category (conditional) */}
      {showCategoryChart && (
        <>
          <h3 className="mt-6 text-lg font-semibold">Tasks by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="count"
                data={categoryCounts}
                cx="50%"
                cy="50%"
                outerRadius={100}
                nameKey="category"
                label
              >
                {categoryCounts.map((entry: any, index: any) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </>
      )}

      {/* Abandonment rate (conditional) */}
      {showAbandonment && (
        <div className="p-4 mt-4 bg-red-100 rounded text-red-900">
          <h3 className="text-lg">Abandonment Rate</h3>
          <p className="text-2xl font-bold">
            {abandonmentRate}% ({abandonedTasks})
          </p>
        </div>
      )}

      {/* Weekly Trends (conditional) */}
      {showWeeklyTrends && (
        <>
          <h3 className="mt-6 text-lg font-semibold">Productivity Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyTrends}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      {/* 🔥 Show the new "predictedTimeByCategory" array */}
      {analytics.predictedTimeByCategory &&
        analytics.predictedTimeByCategory.length > 0 && (
          <>
            <h3 className="mt-6 text-lg font-semibold">
              Predicted Time per Category
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {analytics.predictedTimeByCategory.map((pt: any) => (
                <div
                  key={pt.category}
                  className="p-4 bg-blue-100 rounded shadow-sm text-blue-900"
                >
                  <h4 className="font-semibold">{pt.category}</h4>
                  <p className="text-sm">
                    Predicted average completion:{' '}
                    <strong>{pt.predictedHours} hours</strong>
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
    </div>
  );
}
