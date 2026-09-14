// src/app/admin/page.tsx
export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Master Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 border rounded shadow">
          <h2 className="text-xl font-bold">Tenants</h2>
          <p className="text-4xl mt-4">12</p>
        </div>
        <div className="p-6 border rounded shadow">
          <h2 className="text-xl font-bold">Active Subscriptions</h2>
          <p className="text-4xl mt-4">9</p>
        </div>
        <div className="p-6 border rounded shadow">
          <h2 className="text-xl font-bold">Platform Revenue</h2>
          <p className="text-4xl mt-4">$12,450</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Manage Tenants</h2>
        <table className="w-full text-left border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 p-2">Tenant Name</th>
              <th className="border border-gray-200 p-2">Slug</th>
              <th className="border border-gray-200 p-2">Status</th>
              <th className="border border-gray-200 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 p-2">Demo Restaurant</td>
              <td className="border border-gray-200 p-2">demo-rest</td>
              <td className="border border-gray-200 p-2 text-green-600">Active</td>
              <td className="border border-gray-200 p-2">
                <button className="bg-blue-500 text-white px-4 py-1 rounded">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
