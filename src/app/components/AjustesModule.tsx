import { useState, useEffect } from 'react';

interface AjustesModuleProps {
  barraLateralHorizontal: boolean;
  setBarraLateralHorizontal: (value: boolean) => void;
}

export function AjustesModule({ barraLateralHorizontal, setBarraLateralHorizontal }: AjustesModuleProps) {
  const [tamanoLetra, setTamanoLetra] = useState('16');
  const [tema, setTema] = useState('claro');

  useEffect(() => {
    if (tema === 'oscuro') {
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#1a1a1a';
      document.body.style.color = '#ffffff';
    } else {
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
    }
  }, [tema]);

  const aplicarCambios = () => {
    document.documentElement.style.setProperty('--font-size', `${tamanoLetra}px`);
  };

  return (
    <div>
      <h1 className="mb-6">Ajustes</h1>

      <div className="max-w-2xl space-y-6">
        {/* Tamaño de letra */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="mb-4">Tamaño de Letra</h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="12"
              max="20"
              value={tamanoLetra}
              onChange={(e) => setTamanoLetra(e.target.value)}
              className="flex-1"
            />
            <span className="w-16 text-center">{tamanoLetra}px</span>
          </div>
          <button
            onClick={aplicarCambios}
            className="mt-4 px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors"
          >
            Aplicar
          </button>
        </div>

        {/* Tema (preparado para futuro) */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="mb-4">Tema</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tema"
                value="claro"
                checked={tema === 'claro'}
                onChange={(e) => setTema(e.target.value)}
                className="accent-[#0066ff]"
              />
              <span>Claro</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tema"
                value="oscuro"
                checked={tema === 'oscuro'}
                onChange={(e) => setTema(e.target.value)}
                className="accent-[#0066ff]"
              />
              <span>Oscuro</span>
            </label>
          </div>
        </div>

        {/* Posición de la barra lateral */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="mb-4">Posición de Barra de Navegación</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="posicionBarra"
                checked={!barraLateralHorizontal}
                onChange={() => setBarraLateralHorizontal(false)}
                className="accent-[#0066ff]"
              />
              <span>Lateral (izquierda)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="posicionBarra"
                checked={barraLateralHorizontal}
                onChange={() => setBarraLateralHorizontal(true)}
                className="accent-[#0066ff]"
              />
              <span>Horizontal (superior)</span>
            </label>
          </div>
        </div>

        {/* Información del sistema */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="mb-4">Información del Sistema</h3>
          <div className="space-y-2 text-gray-600">
            <p>Versión: 1.0.0</p>
            <p>Sistema de Monitoreo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
