import { useState } from 'react';
import { Search, Plus } from 'lucide-react';

interface Registro {
  id: string;
  numeroRegistro: string;
  jerarquia: string;
  nombreApellido: string;
  cedula: string;
  compania: string;
  serial: string;
  cargador: string;
  cartucho: string;
  puestoServicio: string;
  revistaGFM: string;
  revistaACargo: string;
  cargo: string;
  observacion: string;
}

const jerarquias = ['SLDDO' < 'DTGDO', 'C/2', 'C/1', 'S/2', 'S/1', 'SM3', 'SM2', 'SM1', 'S/A', 'S/S', 'TTE', 'PTTE', 'CAP', 'MY', 'TCNEL', 'CNEL', 'GB', 'GD', 'MG', 'GJ'];

const registrosIniciales: Registro[] = [
  {
    id: '1',
    numeroRegistro: '01',
    jerarquia: 'SLDDO',
    nombreApellido: 'José Lázaro',
    cedula: '30763261',
    compania: '1ra Compañía',
    serial: '45782391',
    cargador: '4',
    cartucho: '30',
    puestoServicio: 'Polvorín',
    revistaGFM: '160200MAY26',
    revistaACargo: 'SLDDO José Lázaro',
    cargo: 'II Turno',
    observacion: ''
  },
  {
    id: '2',
    numeroRegistro: '02',
    jerarquia: 'SLDDO',
    nombreApellido: 'Gabriel Marques',
    cedula: '29557321',
    compania: '2da Compañía',
    serial: '56893421',
    cargador: '4',
    cartucho: '20',
    puestoServicio: 'Taller',
    revistaGFM: '160223MAY26',
    revistaACargo: 'SLDDO José Lázaro',
    cargo: 'II Turno',
    observacion: ''
  },
  {
    id: '3',
    numeroRegistro: '03',
    jerarquia: 'S/1',
    nombreApellido: 'David Reyes',
    cedula: '34190900',
    compania: '3ra Compañía',
    serial: '78451239',
    cargador: 'Cinta',
    cartucho: '100',
    puestoServicio: 'Cochinera',
    revistaGFM: '160226MAY26',
    revistaACargo: 'SLDDO José Lázaro',
    cargo: 'II Turno',
    observacion: ''
  },
  {
    id: '4',
    numeroRegistro: '04',
    jerarquia: 'C/1',
    nombreApellido: 'Nelson Chirino',
    cedula: '31559942',
    compania: '1ra Compañía',
    serial: '12345678',
    cargador: 'Manual',
    cartucho: '1',
    puestoServicio: 'Prevención',
    revistaGFM: '160227MAY26',
    revistaACargo: 'SLDDO José Lázaro',
    cargo: 'II Turno',
    observacion: ''
  },
  {
    id: '5',
    numeroRegistro: '05',
    jerarquia: 'C/2',
    nombreApellido: 'Mariángel García',
    cedula: '27881882',
    compania: '2da Compañía',
    serial: '98765432',
    cargador: '4',
    cartucho: '10',
    puestoServicio: '3ra Compañía',
    revistaGFM: '160229MAY26',
    revistaACargo: 'SLDDO José Lázaro',
    cargo: 'II Turno',
    observacion: ''
  },
  {
    id: '6',
    numeroRegistro: '06',
    jerarquia: 'SLDDO',
    nombreApellido: 'Pedro González',
    cedula: '30987119',
    compania: '3ra Compañía',
    serial: '34567812',
    cargador: '4',
    cartucho: '120',
    puestoServicio: '2da Compañía',
    revistaGFM: '160231MAY26',
    revistaACargo: 'SLDDO José Lázaro',
    cargo: 'II Turno',
    observacion: ''
  }
];

export function RegistroModule() {
  const [registros, setRegistros] = useState<Registro[]>(registrosIniciales);
  const [tipoFolio, setTipoFolio] = useState<'guardia' | 'parque' | null>(null);
  const [busquedaTipo, setBusquedaTipo] = useState<'fecha' | 'personal'>('fecha');
  const [busqueda, setBusqueda] = useState('');

  const registrosFiltrados = registros.filter(registro => {
    if (busquedaTipo === 'fecha') {
      return registro.revistaGFM.toLowerCase().includes(busqueda.toLowerCase());
    } else {
      return registro.revistaACargo.toLowerCase().includes(busqueda.toLowerCase());
    }
  });

  return (
    <div>
      <h1 className="mb-6">Historial de Folios</h1>

      {!tipoFolio && (
        <div className="flex gap-6 justify-center items-center min-h-[60vh]">
          <button
            onClick={() => setTipoFolio('guardia')}
            className="px-12 py-8 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors text-2xl"
          >
            Folio de Guardia
          </button>
          <button
            onClick={() => setTipoFolio('parque')}
            className="px-12 py-8 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors text-2xl"
          >
            Folio de Parque
          </button>
        </div>
      )}

      {tipoFolio && (
        <>
          <button
            onClick={() => setTipoFolio(null)}
            className="mb-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            ← Volver
          </button>

          {/* Barra de búsqueda */}
          <div className="flex gap-4 mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setBusquedaTipo('fecha')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  busquedaTipo === 'fecha'
                    ? 'bg-[#0066ff] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Por Fecha
              </button>
              <button
                onClick={() => setBusquedaTipo('personal')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  busquedaTipo === 'personal'
                    ? 'bg-[#0066ff] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Por Personal
              </button>
            </div>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={
                  busquedaTipo === 'fecha'
                    ? 'Buscar por fecha (ej. 160200MAY26)...'
                    : 'Buscar por personal...'
                }
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
              />
            </div>
          </div>

          {/* Tabla de registros - Folio de Guardia */}
          {tipoFolio === 'guardia' && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden text-sm">
                <thead className="bg-[#0066ff] text-white">
                  <tr>
                    <th className="px-3 py-3 text-left">N° Reg.</th>
                    <th className="px-3 py-3 text-left">Jerarquía</th>
                    <th className="px-3 py-3 text-left">Nombre y Apellido</th>
                    <th className="px-3 py-3 text-left">C.I.</th>
                    <th className="px-3 py-3 text-left">Compañía</th>
                    <th className="px-3 py-3 text-left">Serial</th>
                    <th className="px-3 py-3 text-left">Cargador</th>
                    <th className="px-3 py-3 text-left">Cartucho</th>
                    <th className="px-3 py-3 text-left">Puesto de Servicio</th>
                    <th className="px-3 py-3 text-left">Revista G-F-M</th>
                    <th className="px-3 py-3 text-left">Revista a Cargo</th>
                    <th className="px-3 py-3 text-left">Cargo</th>
                    <th className="px-3 py-3 text-left">Observación</th>
                  </tr>
                </thead>
                <tbody>
                  {registrosFiltrados.map((registro, index) => (
                    <tr key={registro.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.numeroRegistro}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.jerarquia}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.nombreApellido}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.cedula}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.compania}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.serial}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.cargador}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.cartucho}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.puestoServicio}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.revistaGFM}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.revistaACargo}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.cargo}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.observacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tabla de registros - Folio de Parque */}
          {tipoFolio === 'parque' && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden text-sm">
                <thead className="bg-[#0066ff] text-white">
                  <tr>
                    <th className="px-3 py-3 text-left">N° Reg.</th>
                    <th className="px-3 py-3 text-left">Jerarquía</th>
                    <th className="px-3 py-3 text-left">Nombre y Apellido</th>
                    <th className="px-3 py-3 text-left">C.I.</th>
                    <th className="px-3 py-3 text-left">Compañía</th>
                    <th className="px-3 py-3 text-left">Serial</th>
                    <th className="px-3 py-3 text-left">Cargador</th>
                    <th className="px-3 py-3 text-left">Cartucho</th>
                    <th className="px-3 py-3 text-left">Puesto de Servicio</th>
                    <th className="px-3 py-3 text-left">Revista G-F-M</th>
                    <th className="px-3 py-3 text-left">Revista a Cargo</th>
                    <th className="px-3 py-3 text-left">Observación</th>
                  </tr>
                </thead>
                <tbody>
                  {registrosFiltrados.map((registro, index) => (
                    <tr key={registro.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.numeroRegistro}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.jerarquia}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.nombreApellido}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.cedula}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.compania}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.serial}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.cargador}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.cartucho}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.puestoServicio}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.revistaGFM}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.revistaACargo}</td>
                      <td className="px-3 py-3 border-t border-gray-200">{registro.observacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
