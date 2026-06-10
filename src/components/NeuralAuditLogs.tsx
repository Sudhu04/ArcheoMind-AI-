import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { History, User, Clock, Fingerprint, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { storage } from '../services/storageService';
import { AuditLog } from '../types';

const NeuralAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const unsubscribe = storage.subscribeToAuditLogs(setLogs);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const filteredLogs = logs.filter(log => 
    (log.action || '').toLowerCase().includes(filter.toLowerCase()) ||
    (log.userName || '').toLowerCase().includes(filter.toLowerCase()) ||
    (log.targetName || '').toLowerCase().includes(filter.toLowerCase())
  );

  const sortedLogs = [...filteredLogs].sort((a, b) => b.timestamp - a.timestamp);
  const totalPages = Math.ceil(sortedLogs.length / 10) || 1;
  const currentLogs = sortedLogs.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Administrative Ledger</h4>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 font-display">Neural Audit Trail</h2>
        </div>
        
        <div className="relative w-full max-w-sm">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
           <input 
             type="text"
             placeholder="Search ledger..."
             value={filter}
             onChange={(e) => setFilter(e.target.value)}
             className="w-full bg-white border-2 border-slate-50 rounded-2xl py-3.5 pl-12 pr-6 text-xs font-bold focus:outline-none focus:border-indigo-400 transition-all shadow-sm"
           />
        </div>
      </div>

      <div className="glass-card rounded-[3rem] border-white shadow-2xl overflow-hidden bg-white/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] font-display">Timestamp</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] font-display">Researcher</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] font-display">Action Event</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] font-display">Target Fragment</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] font-display">Node ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentLogs.length === 0 ? (
               <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                     <div className="flex flex-col items-center gap-4 text-slate-400">
                        <History className="w-12 h-12 opacity-20" />
                        <span className="text-[10px] font-black uppercase tracking-widest">No archival activities logged</span>
                     </div>
                  </td>
               </tr>
            ) : (
              currentLogs.map((log, idx) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="hover:bg-white transition-colors group"
                >
                   <td className="px-8 py-5">
                    <div className="flex flex-col gap-0.5 text-slate-500">
                       <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 opacity-50" />
                          <span className="text-[10px] font-bold tabular-nums">
                             {log.timestamp ? new Date(log.timestamp).toLocaleTimeString(undefined, { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
                          </span>
                       </div>
                       <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest pl-5">
                          {log.timestamp ? new Date(log.timestamp).toLocaleDateString() : 'ARCHIVAL_T0'}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-400" />
                       </div>
                       <span className="text-xs font-black text-slate-900">{log.userName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                      log.action.includes('VERIFIED') ? 'bg-emerald-50 text-emerald-600' :
                      log.action.includes('DELETED') ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors">
                      {log.targetName}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400">
                       <Fingerprint className="w-3 h-3 text-slate-200" />
                       {log.id.substring(0, 8).toUpperCase()}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-5 bg-slate-50 rounded-2xl border border-slate-100">
         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center sm:text-left">
            Showing {sortedLogs.length === 0 ? 0 : (currentPage - 1) * 10 + 1}-{Math.min(sortedLogs.length, currentPage * 10)} of {sortedLogs.length} Log Entries (Page {currentPage} of {totalPages})
         </div>
         
         {totalPages > 1 && (
           <div className="flex items-center gap-2">
              <button
                 disabled={currentPage === 1}
                 onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                 className={`p-2 rounded-xl transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed text-slate-400' : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 shadow-sm'}`}
              >
                 <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                 if (totalPages > 5 && Math.abs(pageNum - currentPage) > 1 && pageNum !== 1 && pageNum !== totalPages) {
                    if (pageNum === 2 || pageNum === totalPages - 1) {
                       return <span key={pageNum} className="text-slate-300 text-xs px-1">...</span>;
                    }
                    return null;
                 }
                 return (
                    <button
                       key={pageNum}
                       onClick={() => setCurrentPage(pageNum)}
                       className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          currentPage === pageNum 
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 shadow-sm'
                       }`}
                    >
                       {pageNum}
                    </button>
                 );
              })}
              
              <button
                 disabled={currentPage === totalPages}
                 onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                 className={`p-2 rounded-xl transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed text-slate-400' : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 shadow-sm'}`}
              >
                 <ChevronRight className="w-4 h-4" />
              </button>
           </div>
         )}

         <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
            Export JSON Archive
         </button>
      </div>
    </div>
  );
};

export default NeuralAuditLogs;
