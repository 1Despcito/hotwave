export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">نظرة عامة</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111111] p-6 rounded-lg shadow-sm border border-gray-800">
          <h3 className="text-lg font-medium text-gray-400">الرسائل الجديدة</h3>
          <p className="mt-2 text-3xl font-semibold text-white">0</p>
        </div>
        
        <div className="bg-[#111111] p-6 rounded-lg shadow-sm border border-gray-800">
          <h3 className="text-lg font-medium text-gray-400">الخدمات النشطة</h3>
          <p className="mt-2 text-3xl font-semibold text-white">0</p>
        </div>
        
        <div className="bg-[#111111] p-6 rounded-lg shadow-sm border border-gray-800">
          <h3 className="text-lg font-medium text-gray-400">آراء العملاء</h3>
          <p className="mt-2 text-3xl font-semibold text-white">0</p>
        </div>
      </div>
      
      <div className="mt-12 bg-[#111111] p-6 rounded-lg shadow-sm border border-gray-800">
        <h2 className="text-xl font-bold text-white mb-4">مرحباً بك في لوحة تحكم موقع Hot Wave</h2>
        <p className="text-gray-300">
          من خلال القائمة الجانبية يمكنك التحكم في كافة أقسام الموقع، بما في ذلك النصوص الرئيسية، إضافة أو تعديل الخدمات، مراجعة رسائل الزوار، وإدارة قسم آراء العملاء.
        </p>
      </div>
    </div>
  );
}
