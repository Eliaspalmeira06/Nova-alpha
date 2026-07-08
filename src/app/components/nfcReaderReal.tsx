import React, { useState } from 'react';
import { useNFC } from '../services/nfcServices';
import { Radio, Loader2, CheckCircle, XCircle, Info, AlertCircle } from 'lucide-react';

export const NFCReaderReal: React.FC = () => {
  const [lastRead, setLastRead] = useState<string>('');
  
  const {
    isScanning,
    nfcData,
    error,
    progress,
    isSupported,
    permissionGranted,
    startScan,
    stopScan,
    resetData,
  } = useNFC();

  const handleRead = async () => {
    if (isScanning) {
      stopScan();
      return;
    }
    resetData();
    await startScan();
  };

  if (!isSupported) {
    return (
      <div className="p-6 bg-red-50 border border-red-300 rounded-xl">
        <div className="flex items-center gap-3 text-red-700">
          <XCircle className="w-6 h-6" />
          <div>
            <h3 className="font-bold">NFC no soportado</h3>
            <p className="text-sm">
              Esta aplicación requiere Chrome en Android con NFC habilitado.
              <br />
              Asegúrate de:
              <br />
              • Usar Chrome 89+ en Android
              <br />
              • Tener NFC activado en el dispositivo
              <br />
              • Acceder vía HTTPS o localhost
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Botón de escaneo */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleRead}
          disabled={isScanning}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
            transition-all duration-200
            ${isScanning 
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
            ${!isScanning && 'hover:scale-105'}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isScanning ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Escaneando...
            </>
          ) : (
            <>
              <Radio className="w-5 h-5" />
              Leer Etiqueta NFC
            </>
          )}
        </button>

        {/* Indicador de permisos */}
        {permissionGranted === false && (
          <div className="flex items-center gap-2 text-yellow-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Permisos NFC no otorgados</span>
          </div>
        )}
      </div>

      {/* Mensaje de progreso */}
      {progress && (
        <div className={`
          p-3 rounded-lg flex items-center gap-2
          ${isScanning ? 'bg-blue-50 text-blue-700' : ''}
          ${error ? 'bg-red-50 text-red-700' : ''}
          ${nfcData && !error ? 'bg-green-50 text-green-700' : ''}
        `}>
          {isScanning && <Loader2 className="w-4 h-4 animate-spin" />}
          {error && <XCircle className="w-4 h-4" />}
          {nfcData && !error && <CheckCircle className="w-4 h-4" />}
          <span>{progress}</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-700">Error:</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Datos leídos */}
      {nfcData && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Etiqueta NFC Leída</h3>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">ID:</span>
              <span className="font-mono bg-white px-2 py-1 rounded border border-green-200">
                {nfcData.id}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">Tipo:</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                {nfcData.type}
              </span>
            </div>

            {nfcData.serialNumber && (
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Serial:</span>
                <span className="font-mono text-xs">{nfcData.serialNumber}</span>
              </div>
            )}

            {nfcData.rawData && (
              <div className="mt-2">
                <span className="font-medium text-gray-600">Datos:</span>
                <div className="mt-1 p-2 bg-white border border-green-200 rounded font-mono text-xs break-all">
                  {nfcData.rawData}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">Fecha:</span>
              <span>{nfcData.timestamp.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={resetData}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Limpiar datos
          </button>
        </div>
      )}

      {/* Información adicional */}
      <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4" />
          <span>
            {isScanning 
              ? 'Acerca la etiqueta NFC a la parte trasera del dispositivo'
              : 'Presiona "Leer Etiqueta NFC" para comenzar el escaneo'
            }
          </span>
        </div>
      </div>
    </div>
  );
};