import { useState } from 'react';
import { Search, Plus, Eye, ArrowLeft } from 'lucide-react';

interface Arma {
  serial: string;
  nombre: string;
  modelo: string;
  tipo: string;
  carga: string;
  municion: string;
  calibre: string;
  disponibles: number;
  enUso: number;
  enMantenimiento: number;
}

interface Cargador {
  id: string;
  tipo: string;
  calibre: string;
  municion: string;
  disponibles: number;
  entregados: number;
}

const generarSerial = () => Math.floor(10000000 + Math.random() * 90000000).toString();

const armasIniciales: Arma[] = [
  { serial: generarSerial(), nombre: 'Fusil AK-103', modelo: 'AK-103', tipo: 'Fusil de asalto', carga: 'Cargador extraíble (30 cartuchos)', municion: '7,62 mm', calibre: '7,62 x 39 mm', disponibles: 10, enUso: 3, enMantenimiento: 2 },
  { serial: generarSerial(), nombre: 'Fusil FAL', modelo: 'FAL', tipo: 'Fusil automático liviano', carga: 'Cargador extraíble (20 cartuchos)', municion: '7,62 mm', calibre: '7,62 x 51 mm OTAN', disponibles: 8, enUso: 2, enMantenimiento: 2 },
  { serial: generarSerial(), nombre: 'Ametralladora MAG', modelo: 'MAG / AFAG', tipo: 'Ametralladora de propósito general', carga: 'Cinta eslabonada (50, 100, 200)', municion: '7,62 mm', calibre: '7,62 x 51 mm OTAN', disponibles: 5, enUso: 2, enMantenimiento: 1 },
  { serial: generarSerial(), nombre: 'Cañón Carl Gustaf', modelo: 'Carl Gustaf', tipo: 'Cañón sin retroceso', carga: 'Recarga manual', municion: '84 mm', calibre: 'Proyectil de 84 mm', disponibles: 3, enUso: 0, enMantenimiento: 1 },
  { serial: generarSerial(), nombre: 'Fusil Dragunov', modelo: 'Dragunov (SVD)', tipo: 'Fusil de precisión', carga: 'Cargador (10)', municion: '7,62 mm', calibre: '7,62 x 54 mm R', disponibles: 4, enUso: 1, enMantenimiento: 1 }
];

const cargadoresIniciales: Cargador[] = [
  { id: '1', tipo: 'Cargador AK-103', calibre: '7,62 x 39 mm', municion: '7,62 mm', disponibles: 50, entregados: 15 },
  { id: '2', tipo: 'Cargador FAL', calibre: '7,62 x 51 mm OTAN', municion: '7,62 mm', disponibles: 40, entregados: 10 },
  { id: '3', tipo: 'Cinta FN MAG', calibre: '7,62 x 51 mm OTAN', municion: '7,62 mm', disponibles: 30, entregados: 8 }
];

export function ArmasModule() {
  const [armas, setArmas] = useState<Arma[]>(armasIniciales);
  const [cargadores] = useState<Cargador[]>(cargadoresIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [vistaActual, setVistaActual] = useState<'armas' | 'cargadores'>('armas');
  const [nuevaArma, setNuevaArma] = useState<Arma>({
    serial: '', nombre: '', modelo: '', tipo: '', carga: '', municion: '', calibre: '', disponibles: 0, enUso: 0, enMantenimiento: 0
  });

  const [vista, setVista] = useState<'lista' | 'menuParques' | 'detalle'>('lista');
  const [armaSeleccionada, setArmaSeleccionada] = useState<Arma | null>(null);
  const [parqueSeleccionado, setParqueSeleccionado] = useState<number | null>(null);

  const armasFiltradas = armas.filter(arma =>
    arma.modelo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleAgregarArma = () => {
    if (nuevaArma.modelo) {
      setArmas([...armas, { ...nuevaArma, serial: nuevaArma.serial || generarSerial() }]);
      setMostrarFormulario(false);
    }
  };

  const resetFormulario = () => {
    setNuevaArma({
      serial: '', nombre: '', modelo: '', tipo: '', carga: '', municion: '', calibre: '', disponibles: 0, enUso: 0, enMantenimiento: 0
    });
    setMostrarFormulario(false);
  };

  return (
    <div>
      <h1 className="mb-6">Gestión de Armas</h1>

      <div className="flex gap-2 mb-6">
        <button onClick={() => {
          setVistaActual('armas');
          setVista('lista');
        }} className={`px-6 py-3 rounded-lg ${vistaActual === 'armas' ? 'bg-[#0066ff] text-white' : 'bg-gray-200'}`}>Armas</button>
        <button onClick={() => {
          setVistaActual('cargadores');
          setVista('lista');
        }} className={`px-6 py-3 rounded-lg ${vistaActual === 'cargadores' ? 'bg-[#0066ff] text-white' : 'bg-gray-200'}`}>Cargadores</button>
      </div>

      {vistaActual === 'armas' && (
        <>
          {vista === 'lista' && (
            <>
              <div className="flex gap-4 mb-6">
                <input 
                  placeholder="Buscar por modelo..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                  className="flex-1 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0066ff] outline-none"
                />
                <button onClick={() => setMostrarFormulario(!mostrarFormulario)} className="flex items-center gap-2 px-4 py-2 bg-[#0066ff] text-white rounded-lg">
                  <Plus size={20} /> Agregar
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
                  <thead className="bg-[#0066ff] text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Modelo</th>
                      <th className="px-4 py-3 text-left">Tipo</th>
                      <th className="px-4 py-3 text-left">Carga</th>
                      <th className="px-4 py-3 text-left">Calibre</th>
                      <th className="px-4 py-3 text-left">Munición</th>
                      <th className="px-4 py-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {armasFiltradas.map((arma, index) => (
                      <tr key={arma.serial} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-4 py-3 border-t">{arma.modelo}</td>
                        <td className="px-4 py-3 border-t">{arma.tipo}</td>
                        <td className="px-4 py-3 border-t">{arma.carga}</td>
                        <td className="px-4 py-3 border-t">{arma.calibre}</td>
                        <td className="px-4 py-3 border-t">{arma.municion}</td>
                        <td className="px-4 py-3 border-t text-right">
                          <button 
                            onClick={() => {
                              setArmaSeleccionada(arma);
                              setVista('menuParques');
                            }}
                            className="bg-[#0066ff] text-white px-4 py-2 rounded-lg flex items-center gap-2 ml-auto"
                          >
                            <Eye size={16} /> Ver Parques
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {vista === 'menuParques' && (
            <div>
              <button 
                onClick={() => {
                  setVista('lista');
                  setArmaSeleccionada(null);
                }} 
                className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black"
              >
                <ArrowLeft /> Volver al listado
              </button>
              <h2 className="text-xl font-bold mb-6">Seleccione Parque para: {armaSeleccionada?.modelo}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setParqueSeleccionado(num);
                      setVista('detalle');
                    }}
                    className="px-8 py-6 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors text-xl font-bold shadow-lg"
                  >
                    Parque {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {vista === 'detalle' && armaSeleccionada && (
            <div>
              <button 
                onClick={() => {
                  setVista('menuParques');
                  setParqueSeleccionado(null);
                }} 
                className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black"
              >
                <ArrowLeft /> Regresar a Parques
              </button>
              <h2 className="text-2xl font-bold mb-4">Inventario - Parque {parqueSeleccionado}</h2>
              <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="p-3 text-left">Serial</th>
                      <th className="p-3 text-left">Nombre</th>
                      <th className="p-3 text-left">Modelo</th>
                      <th className="p-3 text-left">Tipo</th>
                      <th className="p-3 text-left">Alimentación</th>
                      <th className="p-3 text-left">Calibre</th>
                      <th className="p-3 text-left">Munición</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3">{armaSeleccionada.serial}</td>
                      <td className="p-3">{armaSeleccionada.nombre}</td>
                      <td className="p-3">{armaSeleccionada.modelo}</td>
                      <td className="p-3">{armaSeleccionada.tipo}</td>
                      <td className="p-3">{armaSeleccionada.carga}</td>
                      <td className="p-3">{armaSeleccionada.calibre}</td>
                      <td className="p-3">{armaSeleccionada.municion}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Formulario para agregar nueva arma */}
          {mostrarFormulario && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Agregar Nueva Arma</h2>
                <div className="space-y-3">
                  <input 
                    placeholder="Nombre" 
                    value={nuevaArma.nombre} 
                    onChange={(e) => setNuevaArma({...nuevaArma, nombre: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                  <input 
                    placeholder="Modelo" 
                    value={nuevaArma.modelo} 
                    onChange={(e) => setNuevaArma({...nuevaArma, modelo: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                  <input 
                    placeholder="Tipo" 
                    value={nuevaArma.tipo} 
                    onChange={(e) => setNuevaArma({...nuevaArma, tipo: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                  <input 
                    placeholder="Carga/Alimentación" 
                    value={nuevaArma.carga} 
                    onChange={(e) => setNuevaArma({...nuevaArma, carga: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                  <input 
                    placeholder="Munición" 
                    value={nuevaArma.municion} 
                    onChange={(e) => setNuevaArma({...nuevaArma, municion: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                  <input 
                    placeholder="Calibre" 
                    value={nuevaArma.calibre} 
                    onChange={(e) => setNuevaArma({...nuevaArma, calibre: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                  <input 
                    type="number" 
                    placeholder="Disponibles" 
                    value={nuevaArma.disponibles} 
                    onChange={(e) => setNuevaArma({...nuevaArma, disponibles: parseInt(e.target.value) || 0})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={handleAgregarArma}
                    className="flex-1 bg-[#0066ff] text-white py-2 rounded-lg"
                  >
                    Agregar
                  </button>
                  <button 
                    onClick={resetFormulario}
                    className="flex-1 bg-gray-300 py-2 rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {vistaActual === 'cargadores' && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-[#0066ff] text-white">
              <tr>
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-left">Calibre</th>
                <th className="px-4 py-3 text-left">Munición</th>
                <th className="px-4 py-3 text-left">Disponibles</th>
                <th className="px-4 py-3 text-left">Entregados</th>
              </tr>
            </thead>
            <tbody>
              {cargadores.map((cargador) => (
                <tr key={cargador.id} className="bg-white">
                  <td className="px-4 py-3 border-t">{cargador.tipo}</td>
                  <td className="px-4 py-3 border-t">{cargador.calibre}</td>
                  <td className="px-4 py-3 border-t">{cargador.municion}</td>
                  <td className="px-4 py-3 border-t">{cargador.disponibles}</td>
                  <td className="px-4 py-3 border-t">{cargador.entregados}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}