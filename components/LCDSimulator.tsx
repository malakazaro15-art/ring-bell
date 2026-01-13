
import React from 'react';

interface LCDSimulatorProps {
  line1: string;
  line2: string;
}

const LCDSimulator: React.FC<LCDSimulatorProps> = ({ line1, line2 }) => {
  // Ensure lines are exactly 16 chars for authentic feel
  const display1 = line1.padEnd(16, ' ').substring(0, 16);
  const display2 = line2.padEnd(16, ' ').substring(0, 16);

  return (
    <div className="bg-slate-800 p-6 rounded-xl border-4 border-slate-700 shadow-2xl inline-block">
      <div className="lcd-screen p-4 rounded-md lcd-font text-4xl tracking-widest leading-none select-none">
        <div className="whitespace-pre uppercase">{display1}</div>
        <div className="whitespace-pre uppercase">{display2}</div>
      </div>
      <div className="flex justify-between mt-4">
        <div className="w-4 h-4 rounded-full bg-slate-600"></div>
        <div className="flex gap-2 text-[10px] text-slate-500 font-mono">
            <span>I2C ADDR: 0x27</span>
            <span>16x2</span>
        </div>
        <div className="w-4 h-4 rounded-full bg-slate-600"></div>
      </div>
    </div>
  );
};

export default LCDSimulator;
