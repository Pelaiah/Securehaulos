export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Welcome to SecureHaul
        </h1>
        {children}
      </div>
    </div>
  );
}
