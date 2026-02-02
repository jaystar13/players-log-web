import { Goll } from '@/entities/goll/model/types';
import { cn } from '@/shared/ui/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Edit, Archive, EyeOff, Eye, AlertCircle, Flag } from 'lucide-react';
import React, { useState } from 'react';

type ManageGollProps = {
  goll: Partial<Goll>;
  isOwner: boolean;
  onEdit: (goll: Goll) => void;
  onArchive: (archive: boolean) => void;
  onDelete: () => void;
  onReport: () => void;
};

export const ManageGoll = ({ goll, isOwner, onEdit, onArchive, onDelete, onReport }: ManageGollProps) => {
  const [showMenu, setShowMenu] = useState(false); 

  const handleEdit = () => {
    setShowMenu(false);
    if (goll.id !== undefined) {
      onEdit(goll as Goll);
    }
  };

  const handleArchive = () => {
    setShowMenu(false);
    onArchive(goll.status !== 'ARCHIVED');
  };
  
  const handleDelete = () => {
    setShowMenu(false);
    if(window.confirm("Are you sure you want to delete this log? This action cannot be undone.")) {
      onDelete();
    }
  };
  
  const handleReport = () => {
    // Logic to open a report modal/form
    onReport();
  }

  if (isOwner) {
    return (
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className={cn(
            "p-2 rounded-full transition-all",
            showMenu ? "bg-[#E1F5FE] text-[#1A237E]" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          )}
        >
          <MoreVertical className="w-5 h-5" />
        </button>
        
        <AnimatePresence>
          {showMenu && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 origin-top-right"
            >
              <div className="p-1">
                <button
                  onClick={handleEdit}
                  disabled={goll.status === 'ARCHIVED'}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit className="w-4 h-4 text-slate-400" />
                  Edit Log
                </button>
                <button 
                  onClick={handleArchive}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left"
                >
                  {goll.status === 'ARCHIVED' ? (
                    <>
                      <Eye className="w-4 h-4 text-slate-400" />
                      Unarchive Log
                    </>
                  ) : (
                    <>
                      <Archive className="w-4 h-4 text-slate-400" />
                      Archive Log
                    </>
                  )}
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <button onClick={handleDelete} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left">
                  <AlertCircle className="w-4 h-4" />
                  Delete Log
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <button onClick={handleReport} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
      <Flag className="w-5 h-5" />
    </button>
  )
};
