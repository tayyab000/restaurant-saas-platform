import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <main className="max-w-4xl w-full bg-white p-12 rounded-xl shadow-lg border border-gray-100 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-6">
          Restaurant Operating System SaaS
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Welcome to the multi-tenant SaaS platform. Select an entry point below to view the application interfaces.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Link href="/restaurant" className="group flex flex-col items-center justify-center p-8 bg-blue-50 hover:bg-blue-600 border border-blue-100 rounded-xl transition-all duration-200">
            <h2 className="text-2xl font-bold text-blue-900 group-hover:text-white mb-4">
              🍽️ Restaurant POS
            </h2>
            <p className="text-blue-700 group-hover:text-blue-100 text-center">
              Access the Point of Sale terminal, menu, and offline-first ordering system.
            </p>
          </Link>

          <Link href="/admin" className="group flex flex-col items-center justify-center p-8 bg-purple-50 hover:bg-purple-600 border border-purple-100 rounded-xl transition-all duration-200">
            <h2 className="text-2xl font-bold text-purple-900 group-hover:text-white mb-4">
              ⚙️ Master Admin
            </h2>
            <p className="text-purple-700 group-hover:text-purple-100 text-center">
              Manage platform tenants, subscriptions, and system-wide configurations.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
