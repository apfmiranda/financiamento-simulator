import FinancingSimulator from "@/components/FinancingSimulator";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-6 md:py-12 relative z-10">
        <header className="mb-6 md:mb-12 text-center md:text-left">
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-black mb-3 md:mb-4 tracking-tighter glow-text">
            Simulador de <span className="text-accent">Financiamento</span>
          </h1>
          <p className="text-white/40 max-w-2xl text-sm md:text-lg font-light leading-relaxed">
            Compare cenários de amortização — <span className="text-accent font-medium">Redução de Prazo</span> vs <span className="text-amber-400 font-medium">Redução de Parcela</span> — e descubra a melhor estratégia para o seu bolso.
          </p>
        </header>

        <FinancingSimulator />
      </div>
    </main>
  );
}
