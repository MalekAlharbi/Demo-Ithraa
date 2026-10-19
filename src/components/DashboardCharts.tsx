import { useMemo } from 'react';
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import type { AssetType } from '../types/custody';

interface DashboardChartsProps {
  saudiCount: number;
  nonSaudiCount: number;
  assetsByType: Record<AssetType, number>;
}

const nationalityColors = ['#008186', '#00b5a4'];
const assetColors = ['#008186', '#00b5a4', '#c19f79'];
const assetLabels: Record<AssetType, string> = {
  سيارة: 'سيارات',
  لابتوب: 'أجهزة إلكترونية',
  'سلفة مالية': 'سلف مالية',
};

export default function DashboardCharts({ saudiCount, nonSaudiCount, assetsByType }: DashboardChartsProps) {
  const workforceData = useMemo(() => [
    { name: 'سعودي', value: saudiCount },
    { name: 'غير سعودي', value: nonSaudiCount },
  ], [saudiCount, nonSaudiCount]);

  const assetData = useMemo(() => (Object.entries(assetsByType) as [AssetType, number][]).map(([type, count]) => ({
    name: assetLabels[type],
    count,
  })), [assetsByType]);

  return (
    <div className="grid gap-5 xl:grid-cols-2" dir="rtl">
      <section className="brand-card rounded-2xl p-5">
        <div className="mb-4"><h2 className="font-bold text-slate-800">توزيع الموظفين</h2><p className="mt-1 text-xs text-slate-400">حسب الجنسية · الموظفون النشطون</p></div>
        <div className="h-64" dir="rtl">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={workforceData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={96} paddingAngle={4} stroke="none">
                {workforceData.map((entry, index) => <Cell key={entry.name} fill={nationalityColors[index]} />)}
              </Pie>
              <Tooltip formatter={(value) => [`${value} موظف`, 'العدد']} />
              <Legend verticalAlign="bottom" iconType="circle" formatter={(value) => <span className="text-xs text-slate-600">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="brand-card rounded-2xl p-5">
        <div className="mb-4"><h2 className="font-bold text-slate-800">توزيع العُهد حسب النوع</h2><p className="mt-1 text-xs text-slate-400">جميع العُهد المسجلة في النظام</p></div>
        <div className="h-64" dir="rtl">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={assetData} margin={{ top: 8, right: 4, left: 0, bottom: 4 }}>
              <CartesianGrid stroke="#e5efed" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" reversed tick={{ fill: '#587b7a', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} orientation="right" tick={{ fill: '#829f9d', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => [`${value} عهدة`, 'العدد']} cursor={{ fill: '#f3f8f7' }} />
              <Bar dataKey="count" name="عدد العُهد" radius={[7, 7, 0, 0]} maxBarSize={54}>
                {assetData.map((entry, index) => <Cell key={entry.name} fill={assetColors[index % assetColors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
