import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Globe, Ship, Map, ArrowRight, Anchor, Navigation, Compass, Layers } from 'lucide-react';

const ROUTES = [
  {
    id: 'spice-route',
    name: 'Maritime Spice Route',
    period: '2nd Century BC - 16th Century AD',
    description: 'The ancient sea connection between the Malabar Coast of India to the Roman Empire and Southeast Asia.',
    hubs: ['Muziris', 'Arikamedu', 'Alexandria', 'Guangzhou'],
    goods: ['Black Pepper', 'Cinnamon', 'Pearls', 'Teakwood'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'silk-road',
    name: 'Northern Silk Road Connection',
    period: '1st Century BC - 14th Century AD',
    description: 'Overland routes linking Kashmir, Mathura and Gandhara with Central Asia and China.',
    hubs: ['Taxila', 'Mathura', 'Kashgar', 'Balkh'],
    goods: ['Silk', 'Wool', 'Spices', 'Buddhist Manuscripts'],
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'dakshinapatha',
    name: 'Dakshinapatha (Great Southern Road)',
    period: 'Mauryan Era - Medieval',
    description: 'Internal highway connecting the Gangetic plains to South Indian kingdoms.',
    hubs: ['Pataliputra', 'Pratishthana', 'Kanchipuram', 'Madurai'],
    goods: ['Iron Tools', 'Precious Stones', 'Salt'],
    color: 'from-emerald-500 to-teal-500'
  }
];

export const TradeRouteExplorer: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState(ROUTES[0]);

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Compass className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Spice Route Navigator</h2>
            <p className="text-xs text-slate-400">Global Commerce & Cultural Flows</p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 divide-x divide-white/10">
        {/* Navigation Panel */}
        <div className="p-4 space-y-2 flex flex-col">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Major Trade Arteries</h3>
          {ROUTES.map((route) => (
            <button
              key={route.id}
              onClick={() => setActiveRoute(route)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                activeRoute.id === route.id
                  ? `bg-gradient-to-br ${route.color} border-transparent text-slate-900 shadow-xl scale-[1.02]`
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {route.id === 'spice-route' ? <Ship className="w-4 h-4" /> : <Map className="w-4 h-4" />}
                <span className="font-bold text-sm leading-tight">{route.name}</span>
              </div>
              <p className={`text-[10px] ${activeRoute.id === route.id ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                {route.period}
              </p>
            </button>
          ))}

          <div className="mt-auto p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Navigation className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-white uppercase">Historical Impact</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed italic">
              These routes were not just for goods; they carried ideas, Buddhism, and Indian mathematical concepts to the world.
            </p>
          </div>
        </div>

        {/* Interactive Visualization Area */}
        <div className="col-span-3 p-8 flex flex-col gap-8 relative overflow-hidden">
          {/* Background Map Decoration */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <Globe className="absolute -right-20 -top-20 w-96 h-96 text-white" />
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <motion.div
                key={activeRoute.id + "-desc"}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${activeRoute.color} text-slate-900 text-[10px] font-bold uppercase tracking-tighter`}>
                  Priority Trade Route
                </div>
                <h3 className="text-3xl font-bold text-white tracking-tighter">{activeRoute.name}</h3>
                <p className="text-slate-400 leading-relaxed">{activeRoute.description}</p>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">Primary Hubs</span>
                  <div className="flex flex-wrap gap-2">
                    {activeRoute.hubs.map((hub) => (
                      <span key={hub} className="px-2 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30 text-[10px] text-blue-200">
                        {hub}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">Traded Goods</span>
                  <div className="flex flex-wrap gap-2">
                    {activeRoute.goods.map((good) => (
                      <span key={good} className="px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-[10px] text-amber-200">
                        {good}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Route Indicator */}
            <div className="flex-1 bg-black/40 rounded-3xl border border-white/5 p-8 flex flex-col items-center justify-center relative min-h-[300px]">
              <div className="absolute top-4 right-4 animate-pulse">
                <Anchor className="w-6 h-6 text-slate-700" />
              </div>
              
              <div className="w-full space-y-8 relative">
                {activeRoute.hubs.map((hub, idx) => (
                  <motion.div
                    key={hub}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${activeRoute.color} shadow-[0_0_10px_rgba(255,255,255,0.2)]`} />
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:to-teal-400 transition-all duration-300">
                      {hub}
                    </span>
                    {idx < activeRoute.hubs.length - 1 && (
                      <div className="absolute left-1 mt-6 h-8 w-px bg-white/20 ml-[5px]" />
                    )}
                  </motion.div>
                ))}
              </div>
              
              <button className="mt-12 w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all group">
                Launch Neural Cartography
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
