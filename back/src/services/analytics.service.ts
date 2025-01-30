import { Task } from '../models/task.model';

export interface AnalyticsResult {
  totalTasks: number;
  abandonedTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number | string;
  avgCompletionTime: number | string;
  productivityByDay: { day: string; count: number }[];
  categoryCounts: { category: string; count: number; color: string }[];
  abandonmentRate: number;
  weeklyTrends: { week: string; count: number }[];
  predictedTimeByCategory: { category: string; predictedHours: number }[];
}

export async function calculateAnalytics(tasks: Task[]): Promise<AnalyticsResult> {
  try {
    const CATEGORY_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    const totalTasks = tasks.length;
    const abandonedTasks = tasks.filter((t) => t.deletedAt && !t.completedAt).length;
    const completedTasks = tasks.filter((t) => t.completedAt).length;
    const pendingTasks = totalTasks - completedTasks - abandonedTasks;
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / (totalTasks - abandonedTasks)) * 100) : 0;

    // Calculate completion times in hours
    const completionTimes = tasks
      .filter((t) => t.completedAt)
      .map(
        (t) =>
          (new Date(t.completedAt!).getTime() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60)
      );

    const avgCompletionTime = completionTimes.length
      ? (completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length).toFixed(2)
      : 'N/A';

    // Productivity by day
    const productivityByDay: Record<string, number> = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };
    tasks.forEach((task) => {
      if (task.completedAt) {
        const day = new Date(task.completedAt).toLocaleDateString('en-US', {
          weekday: 'long',
        });
        if (productivityByDay[day] !== undefined) {
          productivityByDay[day] += 1;
        }
      }
    });
    const productivityByDayArray = Object.entries(productivityByDay).map(([day, count]) => ({
      day,
      count,
    }));

    // Category counts
    const categoryCountsMap: Record<string, number> = {};
    tasks.forEach((task) => {
      if (task.category) {
        categoryCountsMap[task.category] = (categoryCountsMap[task.category] || 0) + 1;
      }
    });
    const categoryCounts = Object.entries(categoryCountsMap).map(([category, count], index) => ({
      category,
      count,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }));

    // Abandonment rate
    const abandonmentRate = totalTasks > 0 ? Math.round((abandonedTasks / totalTasks) * 100) : 0;

    // Weekly trends (last 6 weeks)
    const weeklyData: Record<string, number> = {};
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const week = new Date(today);
      week.setDate(today.getDate() - i * 7);
      const weekLabel = `${week.getMonth() + 1}/${week.getDate()}`;
      weeklyData[weekLabel] = 0;
    }
    tasks.forEach((task) => {
      if (task.completedAt) {
        const week = new Date(task.completedAt);
        const weekLabel = `${week.getMonth() + 1}/${week.getDate()}`;
        if (weeklyData[weekLabel] !== undefined) {
          weeklyData[weekLabel] += 1;
        }
      }
    });
    const weeklyTrends = Object.entries(weeklyData).map(([week, count]) => ({
      week,
      count,
    }));

    interface CategoryTime {
      [key: string]: number[];
    }
    const categoryHours: CategoryTime = {};

    tasks.forEach((t) => {
      if (t.category && t.completedAt) {
        const hours =
          (new Date(t.completedAt!).getTime() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60);
        if (!categoryHours[t.category]) {
          categoryHours[t.category] = [];
        }
        categoryHours[t.category].push(hours);
      }
    });

    const predictedTimeByCategory = Object.entries(categoryHours).map(([cat, hoursArray]) => {
      const avgHours = hoursArray.reduce((sum, x) => sum + x, 0) / hoursArray.length;
      return { category: cat, predictedHours: parseFloat(avgHours.toFixed(2)) };
    });

    return {
      totalTasks,
      abandonedTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      avgCompletionTime,
      productivityByDay: productivityByDayArray,
      categoryCounts,
      abandonmentRate,
      weeklyTrends,
      predictedTimeByCategory,
    };
  } catch (error) {
    throw new Error(`Error calculating analytics: ${error}`);
  }
}
