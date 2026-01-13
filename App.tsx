
import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Clock, Info, AlertCircle, Play, Square } from 'lucide-react';
import LCDSimulator from './components/LCDSimulator.tsx';
import { BELL_SCHEDULE, DURACION_TIMBRE_MS } from './constants.ts';
import { isNonSchoolDay, formatTime } from './utils/bellLogic.ts';

const App: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [isBellRinging, setIsBellRinging] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = new Date();
      setNow(currentTime);

      // Lógica de activación automática del timbre
      if (!isNonSchoolDay(currentTime)) {
        const h = currentTime.getHours();
        const m = currentTime.getMinutes();
        const s = currentTime.getSeconds();

        const triggerMatch = BELL_SCHEDULE.find(
          item => item.hour === h && item.minute === m && s === 0
        );

        if (triggerMatch && !isBellRinging) {
          triggerBell();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isBellRinging]);

  const triggerBell = () => {
    if (isBellRinging) return;
    setIsBellRinging(true);
    setTimeout(() => {
      setIsBellRinging(false);
    }, DURACION_TIMBRE_MS);
  };

  const isLectivo = !isNonSchoolDay(now);
  const timeStr = formatTime(now);
  const lcdLine1 = `HORA ${timeStr.substring(0, 5)}`;
  const lcdLine2 = isLectivo ? "LECTIVO       " : "NO LECTIVO    ";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <header className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-blue-600 text-white transition-all ${isBellRinging ? 'animate-pulse scale-110 shadow-[0_0_15px_rgba(37,99,235,0.6)]' : ''}`}>
              <Bell size={28} />
            </div>
            Timbre Secundaria
          </h1>
          <p className="text-slate-500 mt-1">Simulación Sistema Arduino DS3231</p>
        </div>
        <button 
            onClick={triggerBell}
            disabled={isBellRinging}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                isBellRinging 
                ? 'bg-red-500 text-white animate-bounce' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
            }`}
        >
            {isBellRinging ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            {isBellRinging ? 'TIMBRE ACTIVADO' : 'PRUEBA MANUAL'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center justify-center gap-2">
              <Clock size={14} /> Monitor LCD 16x2
            </h2>
            <LCDSimulator line1={lcdLine1} line2={lcdLine2} />
            <div className="mt-8 flex justify-center gap-6">
               <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <div className={`w-3 h-3 rounded-full ${isLectivo ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`}></div>
                  {isLectivo ? 'Día Lectivo' : 'No Lectivo'}
               </div>
               <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <div className={`w-3 h-3 rounded-full ${isBellRinging ? 'bg-amber-500 animate-ping' : 'bg-slate-300'}`}></div>
                  Relé Pin 8: {isBellRinging ? 'ON' : 'OFF'}
               </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <Bell size={18} className="text-blue-600" /> Horarios Configurados
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest">
                    <th className="px-6 py-4 font-bold">Hora</th>
                    <th className="px-6 py-4 font-bold">Actividad</th>
                    <th className="px-6 py-4 font-bold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {BELL_SCHEDULE.map((item, idx) => {
                    const hStr = String(item.hour).padStart(2, '0');
                    const mStr = String(item.minute).padStart(2, '0');
                    const isUpcoming = (now.getHours() < item.hour) || (now.getHours() === item.hour && now.getMinutes() < item.minute);
                    
                    return (
                      <tr key={idx} className={`transition-colors ${isUpcoming ? 'bg-blue-50/20' : 'opacity-60'}`}>
                        <td className="px-6 py-4 font-mono font-bold text-xl text-slate-700">
                          {hStr}:{mStr}
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">
                          {item.label}
                        </td>
                        <td className="px-6 py-4">
                          {isUpcoming ? (
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-bold uppercase">Pendiente</span>
                          ) : (
                            <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-1 rounded-md font-bold uppercase">Pasado</span>
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

        <div className="space-y-6">
          <div className="bg-slate-800 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
                <Info size={100} />
            </div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 relative z-10">
              <Info size={18} className="text-blue-400" /> Hardware DS3231
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed relative z-10">
              El RTC DS3231 mantiene la hora exacta incluso si falla la alimentación principal de la placa Arduino.
            </p>
            <div className="mt-6 space-y-2 text-xs font-mono relative z-10">
               <div className="flex justify-between p-2 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-500">I2C Addr:</span>
                  <span className="text-blue-400">0x27</span>
               </div>
               <div className="flex justify-between p-2 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-500">Relé Pin:</span>
                  <span className="text-emerald-400">D8</span>
               </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-orange-500" /> Días Especiales
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-xs font-bold text-amber-800">Próximas Vacaciones</p>
                <p className="text-[10px] text-amber-600 mt-1">20 DIC 2025 - 07 ENE 2026</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-bold text-blue-800">Festivos Locales</p>
                <p className="text-[10px] text-blue-600 mt-1">Consulte el calendario oficial de su comunidad.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
             <div className="flex items-start gap-3">
                <AlertCircle className="text-slate-400 flex-shrink-0" size={20} />
                <p className="text-xs text-slate-500 leading-normal">
                    Este software es una simulación visual. En un entorno real, el código C++ se cargaría en un microcontrolador ATmega328P.
                </p>
             </div>
          </div>
        </div>
      </div>

      <footer className="mt-20 py-10 border-t border-slate-200 text-center text-slate-400 text-[10px] uppercase tracking-widest font-bold">
        <p>Sistema desarrollado bajo librerías RTClib y LiquidCrystal_I2C</p>
      </footer>
    </div>
  );
};

export default App;
