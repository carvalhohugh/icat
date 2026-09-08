import Link from 'next/link';

export default function BeneficiarioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="ICAT" className="h-8" />
            <span className="font-bold text-gray-900 text-sm">Painel do Beneficiário</span>
          </div>
          <Link href="/login" className="text-sm text-gray-500 hover:text-red-500">Sair</Link>
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">{children}</main>
    </div>
  );
}
