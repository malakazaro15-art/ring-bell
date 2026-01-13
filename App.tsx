
import React, { useState, useEffect, useRef } from 'react';
import { Bell, Calendar, Clock, Settings, Info, AlertCircle, Play, Square } from 'lucide-react';
import LCDSimulator from './components/LCDSimulator';
import { BELL_SCHEDULE, DURACION_TIMBRE_MS } from './constants';
import { isNonSchoolDay, formatTime } from './utils/bellLogic';

const App: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [isBellRinging, setIsBellRinging] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);
  const bellAudioRef = useRef<HTMLAudioElement | null>(null);

  // Sound generator (simulated buzzer)
  const playBuzzer = () => {
    // In a real browser we might use Web Audio API, but for simplicity
    // we just use a state and maybe a visual indicator.
    setIsBellRinging(true);
    setTimeout(() => {
      setIsBellRinging(false);
    }, DURACION_TIMBRE_MS);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = new Date();
      setNow(currentTime);

      // Bell control logic
      if (!isNonSchoolDay(currentTime)) {
        const h = currentTime.getHours();
        const m = currentTime.getMinutes();
        const s = currentTime.getSeconds();

        const triggerMatch = BELL_SCHEDULE.find(
          item => item.hour === h && item.minute === m && s === 0
        );

        if (triggerMatch && !isBellRinging) {
          playBuzzer();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isBellRinging]);

  const isLectivo = !isNonSchoolDay(now);
  const timeStr = formatTime(now);
  const lcdLine1 = `HORA ${timeStr.substring(0, 5)}`;
  const lcdLine2 = isLectivo ? "LECTIVO       " : "NO LECTIVO    ";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-blue-600 text-white transition-transform ${isBellRinging ? 'animate-bounce' : ''}`}>
              <Bell size={28} />
            </div>
            Gestión de Timbre Escolar
          </h1>
          <p className="text-slate-500 mt-1">Simulación del Sistema Secundaria Arduino</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => playBuzzer()}
                disabled={isBellRinging}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    isBellRinging 
                    ? 'bg-red-100 text-red-600 cursor-not-allowed' 
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                }`}
            >
                {isBellRinging ? <Square size={18} /> : <Play size={18} />}
                {isBellRinging ? 'Timbre Sonando...' : 'Prueba Timbre'}
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Control Panel */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* LCD Card */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center justify-center gap-2">
              <Clock size={16} /> Pantalla LCD RTCLib
            </h2>
            <LCDSimulator line1={lcdLine1} line2={lcdLine2} />
            <div className="mt-6 flex justify-center gap-4">
               <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className={`w-3 h-3 rounded-full ${isLectivo ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {isLectivo ? 'Jornada Académica' : 'Día No Lectivo'}
               </div>
               <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className={`w-3 h-3 rounded-full ${isBellRinging ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}`}></span>
                  Relé: {isBellRinging ? 'ACTIVO' : 'INACTIVO'}
               </div>
            </div>
          </section>

          {/* Schedule Table */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <Bell size={18} className="text-blue-600" /> Horarios de Timbre
              </h3>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">8 Horarios</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-xs uppercase">
                    <th className="px-6 py-4 font-semibold">Hora</th>
                    <th className="px-6 py-4 font-semibold">Evento</th>
                    <th className="px-6 py-4 font-semibold">Próximo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {BELL_SCHEDULE.map((item, idx) => {
                    const timeObj = new Date();
                    timeObj.setHours(item.hour, item.minute, 0);
                    const isPassed = now > timeObj;
                    const isUpcoming = !isPassed && (now.getHours() === item.hour ? now.getMinutes() < item.minute : now.getHours() < item.hour);
                    
                    return (
                      <tr key={idx} className={`hover:bg-slate-50 transition-colors ${isUpcoming ? 'bg-blue-50/30' : ''}`}>
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-lg text-slate-700">
                            {String(item.hour).padStart(2, '0')}:{String(item.minute).padStart(2, '0')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">
                          {item.label}
                        </td>
                        <td className="px-6 py-4">
                          {isUpcoming && (
                            <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded uppercase font-bold tracking-tighter">Siguiente</span>
                          )}
                          {isPassed && !isUpcoming && (
                            <span className="text-[10px] text-slate-300 uppercase font-bold">Completado</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl text-white shadow-lg">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Info size={20} /> Sistema DS3231
            </h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              El reloj en tiempo real mantiene la precisión incluso sin suministro eléctrico. El sistema verifica cada segundo si el horario coincide con la programación actual.
            </p>
            <div className="mt-6 pt-6 border-t border-blue-500/30">
               <div className="flex justify-between text-xs mb-2">
                  <span>Pin Digital:</span>
                  <span className="font-mono bg-blue-800 px-2 rounded">Pin 8</span>
               </div>
               <div className="flex justify-between text-xs">
                  <span>Modo I2C:</span>
                  <span className="font-mono bg-blue-800 px-2 rounded">0x27</span>
               </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-orange-500" /> Próximos Festivos
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex-shrink-0 flex items-center justify-center text-orange-600 font-bold text-xs flex-col">
                  <span>OCT</span>
                  <span>12</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Hispanidad</p>
                  <p className="text-[10px] text-slate-500 uppercase">Feriado Nacional</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex-shrink-0 flex items-center justify-center text-red-600 font-bold text-xs flex-col">
                  <span>DIC</span>
                  <span>20</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Vacaciones Navidad</p>
                  <p className="text-[10px] text-slate-500 uppercase">Inicio de Periodo</p>
                </div>
              </li>
            </ul>
            <button className="w-full mt-6 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
              VER CALENDARIO COMPLETO
            </button>
          </div>

          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex gap-4">
            <AlertCircle className="text-amber-600 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-amber-800 text-sm">Nota de Configuración</h4>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                Asegúrate de que la hora del sistema coincida con la hora oficial para evitar desfases en los cambios de clase.
              </p>
            </div>
          </div>
        </div>

      </div>

      <footer className="mt-20 py-10 border-t border-slate-200 text-center text-slate-400 text-xs">
        <p>© 2024 Sistema de Automatización Escolar - Basado en RTCLib & LiquidCrystal_I2C</p>
      </footer>
    </div>
  );
};

export default App;
