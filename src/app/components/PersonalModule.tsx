import { useState } from 'react';
import { Search, Plus, ArrowUpDown } from 'lucide-react';

interface Personal {
  cedula: string;
  jerarquia: string;
  nombre: string;
  apellido: string;
  contingente: string;
  compania: string;
  telefono: string;
}

const personalInicial: Personal[] = [
  { cedula: '27881882', jerarquia: 'C/2', nombre: 'Mariángel', apellido: 'García', contingente: 'SEP 25', compania: '2da Compañía', telefono:'0412723456'},
  { cedula: '29557321', jerarquia: 'Slddo', nombre: 'Gabriel', apellido: 'Marques', contingente: 'ENE 23', compania: '2da Compañía', telefono: '0422345688'},
  { cedula: '30763261', jerarquia: 'Slddo', nombre: 'José', apellido: 'Lázaro', contingente: 'MAY 21', compania: '1ra Compañía', telefono:'0412123156'},
  { cedula: '30987119', jerarquia: 'Slddo', nombre: 'Pedro', apellido: 'González', contingente: 'SEP 26', compania: '3ra Compañía', telefono: '0412127456'},
  { cedula: '31559942', jerarquia: 'C/1', nombre: 'Nelson', apellido: 'Chirino', contingente: 'MAY 23', compania: '1ra Compañía', telefono: '0412123496'},
  { cedula: '34190900', jerarquia: 'S/1', nombre: 'David', apellido: 'Reyes', contingente: 'ENE 21', compania: '3ra Compañía' , telefono: '0412123356'},
];

type OrdenTipo = 'cedula' | 'compania';
type BusquedaTipo = 'cedula' | 'jerarquia' | 'contingente' | 'compania';

export function PersonalModule() {
  const [personal, setPersonal] = useState<Personal[]>(personalInicial);
  const [orden, setOrden] = useState<OrdenTipo>('cedula');
  const [busquedaTipo, setBusquedaTipo] = useState<BusquedaTipo>('cedula');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoPersonal, setNuevoPersonal] = useState<Personal>({
    cedula: '',
    jerarquia: '',
    nombre: '',
    apellido: '',
    contingente: '',
    compania: '',
    telefono: '',
  });

  const handleAgregarPersonal = () => {
    if (nuevoPersonal.cedula && nuevoPersonal.nombre && nuevoPersonal.apellido) {
      setPersonal([...personal, nuevoPersonal]);
      setNuevoPersonal({
        cedula: '',
        jerarquia: '',
        nombre: '',
        apellido: '',
        contingente: '',
        compania: '',
        telefono: '',
      });
      setMostrarFormulario(false);
    }
  };

  let personalFiltrado = personal.filter(p => {
    const valor = busqueda.toLowerCase();
    switch (busquedaTipo) {
      case 'cedula':
        return p.cedula.includes(valor);
      case 'jerarquia':
        return p.jerarquia.toLowerCase().includes(valor);
      case 'contingente':
        return p.contingente.toLowerCase().includes(valor);
      case 'compania':
        return p.compania.toLowerCase().includes(valor);
      default:
        return true;
    }
  });

  personalFiltrado = [...personalFiltrado].sort((a, b) => {
    if (orden === 'cedula') {
      return a.cedula.localeCompare(b.cedula);
    } else {
      return a.compania.localeCompare(b.compania) || a.cedula.localeCompare(b.cedula);
    }
  });

  return (
    <div>
      <h1 className="mb-6">Gestión de Personal</h1>

      {/* Controles */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex gap-2">
          <button
            onClick={() => setOrden('cedula')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              orden === 'cedula'
                ? 'bg-[#0066ff] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ArrowUpDown size={16} />
            Por Cédula
          </button>
          <button
            onClick={() => setOrden('compania')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              orden === 'compania'
                ? 'bg-[#0066ff] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ArrowUpDown size={16} />
            Por Compañía
          </button>
        </div>

        <select
          value={busquedaTipo}
          onChange={(e) => setBusquedaTipo(e.target.value as BusquedaTipo)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
        >
          <option value="cedula">Buscar por Cédula</option>
          <option value="jerarquia">Buscar por Jerarquía</option>
          <option value="contingente">Buscar por Contingente</option>
          <option value="compania">Buscar por Compañía</option>
        </select>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
          />
        </div>

        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors"
        >
          <Plus size={20} />
          Agregar
        </button>
      </div>

      {/* Formulario */}
      {mostrarFormulario && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
          <h3 className="mb-4">Nuevo Personal</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Cédula"
              value={nuevoPersonal.cedula}
              onChange={(e) => setNuevoPersonal({ ...nuevoPersonal, cedula: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
            />
            <input
              type="text"
              placeholder="Jerarquía"
              value={nuevoPersonal.jerarquia}
              onChange={(e) => setNuevoPersonal({ ...nuevoPersonal, jerarquia: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
            />
            <input
              type="text"
              placeholder="Nombre"
              value={nuevoPersonal.nombre}
              onChange={(e) => setNuevoPersonal({ ...nuevoPersonal, nombre: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
            />
            <input
              type="text"
              placeholder="Apellido"
              value={nuevoPersonal.apellido}
              onChange={(e) => setNuevoPersonal({ ...nuevoPersonal, apellido: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
            />
            <input
              type="text"
              placeholder="Contingente"
              value={nuevoPersonal.contingente}
              onChange={(e) => setNuevoPersonal({ ...nuevoPersonal, contingente: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
            />
            <input
              type="text"
              placeholder="Compañía"
              value={nuevoPersonal.compania}
              onChange={(e) => setNuevoPersonal({ ...nuevoPersonal, compania: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
            />
            <input
              type="text"
              placeholder="Telefono"
              value={nuevoPersonal.telefono}
              onChange={(e) => setNuevoPersonal({ ...nuevoPersonal, telefono: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAgregarPersonal}
              className="px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors"
            >
              Guardar
            </button>
            <button
              onClick={() => setMostrarFormulario(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-[#0066ff] text-white">
            <tr>
              <th className="px-4 py-3 text-left">Cédula</th>
              <th className="px-4 py-3 text-left">Jerarquía</th>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Apellido</th>
              <th className="px-4 py-3 text-left">Contingente</th>
              <th className="px-4 py-3 text-left">Compañía</th>
              <th className="px-4 py-3 text-left">Telefono</th>
            </tr>
          </thead>
          <tbody>
            {personalFiltrado.map((p, index) => (
              <tr key={p.cedula} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-4 py-3 border-t border-gray-200">{p.cedula}</td>
                <td className="px-4 py-3 border-t border-gray-200">{p.jerarquia}</td>
                <td className="px-4 py-3 border-t border-gray-200">{p.nombre}</td>
                <td className="px-4 py-3 border-t border-gray-200">{p.apellido}</td>
                <td className="px-4 py-3 border-t border-gray-200">{p.contingente}</td>
                <td className="px-4 py-3 border-t border-gray-200">{p.compania}</td>
                <td className="px-4 py-3 border-t border-gray-200">{p.telefono}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
