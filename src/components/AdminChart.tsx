"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminChart({ data }: { data: { name: string; count: number }[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 border border-gray-800 rounded-xl bg-[#111111]">
        لا توجد بيانات كافية لعرض الرسم البياني.
      </div>
    );
  }

  // Define custom colors or use a gradient approach
  const formatData = data.map(item => ({
    ...item,
    // Add a color property or just use fill inside Bar
  }));

  return (
    <div className="bg-[#111111] p-6 rounded-2xl shadow-xl border border-gray-800">
      <h3 className="text-xl font-bold text-white mb-6">إحصائيات أكثر الخدمات طلباً 📈</h3>
      <div className="h-80 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formatData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#888" 
              tick={{ fill: '#ccc', fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: '#444' }}
            />
            <YAxis 
              stroke="#888" 
              tick={{ fill: '#ccc' }} 
              tickLine={false} 
              axisLine={false} 
              allowDecimals={false}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#00e5ff' }}
            />
            <Bar 
              dataKey="count" 
              fill="#ff6b00" 
              radius={[6, 6, 0, 0]} 
              name="عدد الطلبات"
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
