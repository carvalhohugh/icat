'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, QrCode, ScanFace, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';

export default function ControleAcesso() {
  const [scanMode, setScanMode] = useState<'qr' | 'facial'>('qr');
  const [simulatedId, setSimulatedId] = useState('');
  const [accessResult, setAccessResult] = useState<{status: 'granted' | 'denied' | 'suspended', name: string, message: string} | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const users = [
    { id: '1', name: 'Maria da Silva (Aluna)', status: 'Aprovado' },
    { id: '2', name: 'João Oliveira (Aluno)', status: 'Suspenso' },
    { id: '1001', name: 'José Souza (Beneficiário)', status: 'Aprovado' },
    { id: 'func-1', name: 'Carlos Silva (Professor)', status: 'Aprovado' },
  ];

  const processScan = (idStr: string) => {
    // Tenta limpar o prefixo icat-access- se vier do QRCode Real
    let cleanId = idStr.replace('icat-access-', '');
    
    const user = users.find(u => u.id === cleanId || u.id === idStr);
    
    if (!user) {
      setAccessResult({ status: 'denied', name: 'Desconhecido', message: 'Cadastro não encontrado no sistema.' });
    } else if (user.status === 'Suspenso') {
      setAccessResult({ status: 'suspended', name: user.name, message: 'Acesso Negado: Cadastro Suspenso.' });
    } else {
      setAccessResult({ status: 'granted', name: user.name, message: 'Acesso Liberado.' });
    }
  };

  const handleSimulateScan = () => {
    if (!simulatedId) return;
    processScan(simulatedId);
  };

  // Loop de leitura do QR Code usando a Webcam
  useEffect(() => {
    let interval: any;
    if (scanMode === 'qr' && !accessResult) {
      interval = setInterval(() => {
        if (webcamRef.current) {
          const imageSrc = webcamRef.current.getScreenshot();
          if (imageSrc) {
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, img.width, img.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                  inversionAttempts: "dontInvert",
                });
                if (code) {
                  processScan(code.data);
                }
              }
            };
          }
        }
      }, 500); // 2 fps de leitura para não travar o navegador
    }
    
    // Simulação de reconhecimento facial
    if (scanMode === 'facial' && !accessResult) {
      interval = setInterval(() => {
        // Num app real aqui enviaria o frame para uma API de face recognition.
        // Vamos apenas simular uma detecção de rosto aleatória após alguns segundos (mock).
        if(Math.random() > 0.95) {
          processScan('1'); // Finge que reconheceu a Maria
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [scanMode, accessResult]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catraca Virtual</h1>
          <p className="text-gray-500 text-sm mt-1">Controle de acesso via QR Code ou Reconhecimento Facial usando sua Câmera.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Lado Esquerdo: Câmera */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-center gap-4 bg-gray-50">
            <button onClick={() => setScanMode('qr')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${scanMode === 'qr' ? 'bg-icat-blue text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
              <QrCode className="w-4 h-4" /> Leitor de QR Code
            </button>
            <button onClick={() => setScanMode('facial')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${scanMode === 'facial' ? 'bg-icat-blue text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
              <ScanFace className="w-4 h-4" /> Reconhecimento Facial
            </button>
          </div>
          
          <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden min-h-[350px]">
            {!accessResult ? (
              <>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: 'environment' }}
                  className="w-full h-full object-cover absolute inset-0 opacity-90"
                />
                
                {scanMode === 'facial' ? (
                  <div className="absolute inset-0 border-4 border-dashed border-green-500/50 rounded-[4rem] m-12 pointer-events-none animate-pulse"></div>
                ) : (
                  <div className="absolute w-48 h-48 border-2 border-white/50 pointer-events-none z-10">
                     <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-icat-green"></div>
                     <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-icat-green"></div>
                     <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-icat-green"></div>
                     <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-icat-green"></div>
                  </div>
                )}
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-white/90 text-sm font-medium z-10 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  Câmera Ativa
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
                <Camera className="w-16 h-16 text-gray-600 mb-4" />
                <p className="text-gray-400 font-medium">Câmera Pausada.</p>
                <p className="text-gray-500 text-sm">Limpe o resultado para escanear o próximo.</p>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Simulação Manual / Digitação de ID</label>
            <div className="flex gap-2">
              <input type="text" value={simulatedId} onChange={e => setSimulatedId(e.target.value)} placeholder="Digite o ID (ex: 1, 1001, func-1)" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-blue outline-none" onKeyDown={(e) => e.key === 'Enter' && handleSimulateScan()} />
              <button onClick={handleSimulateScan} className="btn-primary">Ler</button>
            </div>
          </div>
        </div>

        {/* Lado Direito: Resultado */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center items-center text-center">
          {!accessResult ? (
            <div className="text-gray-400">
              {scanMode === 'qr' ? (
                <QrCode className="w-24 h-24 mx-auto mb-4 opacity-40 animate-pulse" />
              ) : (
                <ScanFace className="w-24 h-24 mx-auto mb-4 opacity-40 animate-pulse" />
              )}
              <h3 className="text-xl font-bold text-gray-700">Aguardando Leitura...</h3>
              <p className="text-sm mt-2 text-gray-500">
                {scanMode === 'qr' ? 'Aponte o QR Code da carteirinha para a câmera.' : 'Posicione o rosto do aluno em frente à câmera.'}
              </p>
            </div>
          ) : (
            <div className="w-full animate-in zoom-in duration-300 flex flex-col items-center justify-center">
              {accessResult.status === 'granted' && <CheckCircle className="w-32 h-32 mx-auto mb-6 text-green-500" />}
              {accessResult.status === 'denied' && <XCircle className="w-32 h-32 mx-auto mb-6 text-red-500" />}
              {accessResult.status === 'suspended' && <AlertTriangle className="w-32 h-32 mx-auto mb-6 text-orange-500" />}
              
              <h2 className="text-3xl font-black text-gray-900 mb-2">{accessResult.name}</h2>
              
              <div className={`mt-4 inline-block px-8 py-4 rounded-full text-xl font-bold shadow-sm ${
                accessResult.status === 'granted' ? 'bg-green-100 text-green-700 border-2 border-green-200' : 
                accessResult.status === 'denied' ? 'bg-red-100 text-red-700 border-2 border-red-200' : 
                'bg-orange-100 text-orange-700 border-2 border-orange-200'
              }`}>
                {accessResult.message}
              </div>
              
              <button 
                onClick={() => {
                  setAccessResult(null);
                  setSimulatedId('');
                }} 
                className="mt-12 text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 px-8 py-3 rounded-xl transition-colors shadow-lg"
              >
                Próxima Leitura (Limpar)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
