import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useAuth } from './AuthContext'; // Importamos el hook

export function Login() {
  const { login } = useAuth(); // Obtenemos la función login del contexto
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(valor)) {
      setUsuario(valor);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (usuario === 'admin' && contrasena === '123') {
      login('admin', 'Administrador');
    } else if (usuario === 'user' && contrasena === '123') {
      login('user', 'Usuario Estándar');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 w-full max-w-md">
        <h1 className="text-3xl mb-8 text-center">Inicio de Sesión</h1>

        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block mb-2">Usuario</label>
            <input
              type="text"
              value={usuario}
              onChange={handleUsuarioChange}
              placeholder="Ingrese su usuario"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2">Contraseña</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Ingrese su contraseña"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}