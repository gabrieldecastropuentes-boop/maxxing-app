export function MissionScreen({ onContinue, onBack }: { onContinue: () => void; onBack: () => void }) {
  return (
    <div className="quiz-screen min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      
      {/* Header */}
      <div className="p-6">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Container Principal */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-6xl mx-auto">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF4D4D]/20 border border-[#FF4D4D]/40 mb-8">
          <svg className="w-4 h-4 text-[#FF4D4D]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs font-bold text-[#FF4D4D]">NOSSA MISSÃO</span>
        </div>

        {/* Título */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center leading-tight mb-4 sm:mb-6 px-2">
          Transformar vidas através da <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D4D] to-[#FF8A00]">ciência da atratividade</span>
        </h1>

        {/* Subtítulo */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 text-center max-w-4xl mb-8 sm:mb-10 md:mb-12 leading-relaxed px-4">
          Utilizamos inteligência artificial e ciência comprovada para ajudar você a alcançar seu máximo potencial estético
        </p>

        {/* Imagem de Confiança - REFERÊNCIA VISUAL */}
        <div className="relative w-full max-w-4xl mb-8 sm:mb-12">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
            {/* Imagem principal */}
            <img 
              src="/media/clinica.jpg" 
              alt="Nossa equipe de especialistas"
              className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover"
              onError={(e) => {
                // Fallback se a imagem não existir
                const target = e.currentTarget;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            
            {/* Fallback se imagem não existir */}
            <div className="hidden w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-24 h-24 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-500">Equipe de Especialistas</p>
              </div>
            </div>
            
            {/* Overlay com gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* Conteúdo sobre a imagem */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-4">
                <div className="flex -space-x-2 sm:-space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 sm:border-3 border-[#0A0A0A] bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-[10px] sm:text-xs md:text-sm">
                    Dr.
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 sm:border-3 border-[#0A0A0A] bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center font-bold text-[10px] sm:text-xs md:text-sm">
                    Dra.
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 sm:border-3 border-[#0A0A0A] bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-[9px] sm:text-[10px] md:text-sm">
                    +8
                  </div>
                </div>
                <div>
                  <p className="font-bold text-sm sm:text-base md:text-lg">Equipe Multidisciplinar</p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-300">Dermatologistas, Nutricionistas e Esteticistas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl mb-8 sm:mb-12">
          
          {/* Valor 1: Ciência */}
          <div className="p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 rounded-lg sm:rounded-xl bg-blue-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">Baseado em Ciência</h3>
            <p className="text-xs sm:text-sm text-gray-400">Todos os protocolos são validados por estudos científicos</p>
          </div>

          {/* Valor 2: Personalização */}
          <div className="p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 rounded-lg sm:rounded-xl bg-[#FF4D4D]/20 flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#FF4D4D]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">100% Personalizado</h3>
            <p className="text-xs sm:text-sm text-gray-400">Cada plano é único e adaptado ao seu perfil</p>
          </div>

          {/* Valor 3: Resultados */}
          <div className="p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 rounded-lg sm:rounded-xl bg-green-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">Resultados Reais</h3>
            <p className="text-xs sm:text-sm text-gray-400">+2.800 transformações comprovadas</p>
          </div>
        </div>

        {/* Estatísticas de Impacto */}
        <div className="w-full max-w-5xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FF4D4D]/10 to-[#FF8A00]/10 border border-[#FF4D4D]/30 mb-8 sm:mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D4D] to-[#FF8A00] mb-1 sm:mb-2">
                98%
              </p>
              <p className="text-xs sm:text-sm text-gray-400">Taxa de Satisfação</p>
            </div>

            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D4D] to-[#FF8A00] mb-1 sm:mb-2">
                2.8K+
              </p>
              <p className="text-xs sm:text-sm text-gray-400">Clientes Atendidos</p>
            </div>

            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D4D] to-[#FF8A00] mb-1 sm:mb-2">
                4.9★
              </p>
              <p className="text-xs sm:text-sm text-gray-400">Avaliação Média</p>
            </div>

            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D4D] to-[#FF8A00] mb-1 sm:mb-2">
                90d
              </p>
              <p className="text-xs sm:text-sm text-gray-400">Resultados Visíveis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botão Continuar */}
      <div className="p-4 sm:p-6 pb-6 sm:pb-8 md:pb-10 safe-bottom">
        <button
          onClick={onContinue}
          className="w-full max-w-2xl mx-auto px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-[#FF4D4D] to-[#FF8A00] hover:opacity-90 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg md:text-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-[#FF4D4D]/40 block min-h-[48px] touch-manipulation"
        >
          Continuar para Minha Análise →
        </button>
      </div>
    </div>
  );
}

