import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Send, 
  Eye, 
  CheckCheck,
  Flame,
  UserX,
  DoorOpen,
  Dog
} from 'lucide-react';
import { Language, SecurityIncident } from '../../types';
import { translations } from '../../i18n/translations';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: SecurityIncident[];
  onResolveIncident: (id: string) => void;
  onDispatchRobot: (incident: SecurityIncident) => void;
  lang: Language;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  incidents,
  onResolveIncident,
  onDispatchRobot,
  lang
}) => {
  const t = translations[lang];
  const unresolved = incidents.filter(i => !i.resolved);

  const getIncidentIcon = (type: SecurityIncident['snapshotType']) => {
    switch (type) {
      case 'fire':
        return <Flame className="w-4 h-4 text-red-500" />;
      case 'person':
        return <UserX className="w-4 h-4 text-amber-500" />;
      case 'door':
        return <DoorOpen className="w-4 h-4 text-blue-500" />;
      case 'pet':
        return <Dog className="w-4 h-4 text-purple-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    }
  };

  const getSeverityBadge = (severity: SecurityIncident['severity']) => {
    switch (severity) {
      case 'danger':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-100 text-red-700 border border-red-200">{t.dangerBadge}</span>;
      case 'warning':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">{t.warningBadge}</span>;
      case 'safe':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">{t.safeBadge}</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700 border border-blue-200">{t.infoBadge}</span>;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Slide-over Drawer Panel from Right */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {t.notifications}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {unresolved.length} {t.unreadAlerts}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of Incidents */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
              {incidents.length === 0 ? (
                <div className="py-16 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700">{t.noIncidents}</p>
                </div>
              ) : (
                incidents.map((incident) => {
                  const title = lang === 'vi' ? incident.titleVI : incident.titleEN;
                  const desc = lang === 'vi' ? incident.descVI : incident.descEN;
                  const zone = lang === 'vi' ? incident.zoneVI : incident.zoneEN;

                  return (
                    <div
                      key={incident.id}
                      className={`pt-3 first:pt-0 p-3.5 rounded-xl border transition-all ${
                        incident.resolved
                          ? 'bg-slate-50/60 border-slate-200 opacity-60'
                          : incident.severity === 'danger'
                            ? 'bg-red-50/50 border-red-200'
                            : incident.severity === 'warning'
                              ? 'bg-amber-50/50 border-amber-200'
                              : 'bg-white border-slate-200 shadow-2xs'
                      }`}
                    >
                      {/* Top row */}
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 rounded-lg bg-white shadow-2xs border border-slate-200">
                            {getIncidentIcon(incident.snapshotType)}
                          </div>
                          <span className="text-xs font-bold text-slate-900">
                            {title}
                          </span>
                        </div>
                        {getSeverityBadge(incident.severity)}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                        {desc}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium mb-3">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-semibold">
                          📍 {zone}
                        </span>
                        <span>{incident.timestamp}</span>
                      </div>

                      {/* Action buttons */}
                      {!incident.resolved ? (
                        <div className="flex items-center space-x-2 pt-1">
                          <button
                            onClick={() => onDispatchRobot(incident)}
                            className="flex-1 py-1.5 px-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{t.dispatchRobot}</span>
                          </button>

                          <button
                            onClick={() => onResolveIncident(incident.id)}
                            className="py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
                          >
                            {t.dismissAlert}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center text-xs font-semibold text-emerald-600 space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{lang === 'vi' ? 'Đã xử lý an toàn' : 'Resolved & Secured'}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                HSMIBot Security Dispatch
              </span>
              <button
                onClick={() => {
                  incidents.forEach(i => onResolveIncident(i.id));
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <CheckCheck className="w-4 h-4" />
                <span>{t.markAllRead}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
