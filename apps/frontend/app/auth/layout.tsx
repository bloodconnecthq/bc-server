export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Panneau gauche — visuel */}
      <div className="hidden lg:flex lg:w-1/2 bg-red-600 flex-col justify-between p-12 relative overflow-hidden">
        {/* Cercles décoratifs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-500 rounded-full opacity-50" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-red-700 rounded-full opacity-40" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C12 2 4 10.5 4 15.5C4 19.642 7.582 23 12 23C16.418 23 20 19.642 20 15.5C20 10.5 12 2 12 2Z" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg">Blood-Connect</span>
        </div>

        {/* Texte central */}
        <div className="relative z-10 space-y-4">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Chaque don compte.<br />Chaque vie aussi.
          </h2>
          <p className="text-red-100 text-base leading-relaxed max-w-sm">
            La plateforme numérique qui connecte donneurs, hôpitaux et centres
            de transfusion sanguine en République du Bénin.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { value: "50K+", label: "Donneurs" },
            { value: "120", label: "Centres" },
            { value: "3 vies", label: "Par don" },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 backdrop-blur rounded-2xl p-4">
              <p className="text-white font-bold text-xl">{s.value}</p>
              <p className="text-red-200 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Panneau droit — formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}