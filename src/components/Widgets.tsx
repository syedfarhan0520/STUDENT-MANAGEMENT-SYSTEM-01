import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sun, CloudRain, Clock, Calendar as CalIcon, CloudLightning, RefreshCw, Plus, Trash2, Award, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

// DIGITAL CLOCK WIDGET
export const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    let hours = time.getHours();
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    let ampm = '';

    if (!is24Hour) {
      ampm = hours >= 12 ? ' PM' : ' AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
    }

    const hrs = String(hours).padStart(2, '0');
    return `${hrs}:${minutes}:${seconds}${ampm}`;
  };

  const dayOfWeek = time.toLocaleDateString(undefined, { weekday: 'long' });
  const formattedDate = time.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/15">
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/20 rounded-full blur-2xl" />
      <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-pink-500/20 rounded-full blur-2xl" />
      
      <div className="relative flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider uppercase text-indigo-200">Terminal Time</span>
        </div>
        <button
          onClick={() => setIs24Hour(!is24Hour)}
          className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors border border-white/5 cursor-pointer"
        >
          {is24Hour ? '12 HR' : '24 HR'}
        </button>
      </div>

      <div className="relative font-mono text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-pink-200 mb-1">
        {formatTime()}
      </div>

      <div className="text-xs text-indigo-200/80 font-medium">
        {dayOfWeek} &bull; {formattedDate}
      </div>
    </div>
  );
};

// DYNAMIC WEATHER WIDGET
export const WeatherWidget: React.FC = () => {
  const [isCelsius, setIsCelsius] = useState(true);
  const [weatherIndex, setWeatherIndex] = useState(0);

  const weathers = [
    { city: 'Campus HQ', tempC: 22, condition: 'Golden Sunshine', desc: 'Perfect study weather', icon: <Sun className="w-8 h-8 text-amber-400 animate-spin-slow" /> },
    { city: 'Campus HQ', tempC: 16, condition: 'Cyber Drizzle', desc: 'Carry an umbrella', icon: <CloudRain className="w-8 h-8 text-sky-400" /> },
    { city: 'Campus HQ', tempC: 25, condition: 'Tesla Storm', desc: 'Electrical discharges active', icon: <CloudLightning className="w-8 h-8 text-indigo-400" /> },
  ];

  const current = weathers[weatherIndex];

  const toggleWeather = () => {
    setWeatherIndex((prev) => (prev + 1) % weathers.length);
  };

  const getTemp = () => {
    if (isCelsius) return `${current.tempC}°C`;
    return `${Math.round((current.tempC * 9) / 5 + 32)}°F`;
  };

  return (
    <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800/80 dark:to-indigo-950/20 text-slate-800 dark:text-slate-100 shadow-xl border border-slate-200/50 dark:border-slate-800/60">
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-yellow-400/20 dark:bg-amber-400/10 rounded-full blur-2xl" />
      
      <div className="relative flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500">Local Weather</span>
          <h4 className="text-sm font-bold mt-0.5">{current.city}</h4>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={toggleWeather}
            className="p-1.5 rounded-xl bg-slate-200/60 dark:bg-slate-800 hover:bg-slate-300/60 dark:hover:bg-slate-700 transition-colors border border-slate-300/20 dark:border-slate-700/50 cursor-pointer"
            title="Force refresh weather system"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </button>
          <button
            onClick={() => setIsCelsius(!isCelsius)}
            className="text-[10px] font-bold px-2 py-1 rounded bg-slate-200/60 dark:bg-slate-800 hover:bg-slate-300/60 dark:hover:bg-slate-700 transition-colors border border-slate-300/20 dark:border-slate-700/50 cursor-pointer"
          >
            {isCelsius ? '°F' : '°C'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-inner border border-slate-200/20 dark:border-slate-700/30">
          {current.icon}
        </div>
        <div>
          <span className="text-2xl font-black font-mono tracking-tight bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-indigo-200">
            {getTemp()}
          </span>
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{current.condition}</p>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-4 font-medium italic">
        &ldquo;{current.desc}&rdquo;
      </p>
    </div>
  );
};

// MINI INTERACTIVE CALENDAR WIDGET
export const MiniCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(<div key={`empty-${i}`} className="text-center p-1 text-slate-300 dark:text-slate-800 text-[10px]" />);
  }

  for (let day = 1; day <= totalDays; day++) {
    const isToday = isCurrentMonth && today.getDate() === day;
    daysArray.push(
      <div
        key={`day-${day}`}
        className={`text-center p-1 text-[11px] font-mono rounded-lg transition-all ${
          isToday
            ? 'bg-gradient-to-br from-indigo-500 to-pink-500 text-white font-extrabold shadow-md shadow-indigo-500/20'
            : 'hover:bg-slate-200/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
        }`}
      >
        {day}
      </div>
    );
  }

  return (
    <div className="p-5 rounded-3xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900 border border-slate-200/50 dark:border-slate-800/60 shadow-xl">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-xs font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <CalIcon className="w-4 h-4 text-pink-500" />
          <span>Calendar Grid</span>
        </h4>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="text-[10px] font-extrabold px-1.5 py-0.5 rounded hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            &larr;
          </button>
          <span className="text-[11px] font-bold px-1 text-slate-800 dark:text-slate-200">
            {monthNames[month].substring(0, 3)} &apos;{String(year).substring(2)}
          </span>
          <button
            onClick={nextMonth}
            className="text-[10px] font-extrabold px-1.5 py-0.5 rounded hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            &rarr;
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold tracking-wider text-slate-400 dark:text-slate-600 mb-1 uppercase">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysArray}
      </div>
    </div>
  );
};

// QUICK ACTIONS PANEL
export const QuickActions: React.FC<{
  onOpenAddStudent: () => void;
  onNavigate: (view: string) => void;
}> = ({ onOpenAddStudent, onNavigate }) => {
  const { clearNotifications, showToast } = useApp();

  const actions = [
    {
      title: 'Admit Student',
      desc: 'Enlist new scholar',
      icon: <Plus className="w-4 h-4" />,
      color: 'from-blue-500 to-indigo-500 shadow-blue-500/10',
      action: onOpenAddStudent,
    },
    {
      title: 'Exams Roster',
      desc: 'Check room assignments',
      icon: <Zap className="w-4 h-4" />,
      color: 'from-pink-500 to-purple-500 shadow-pink-500/10',
      action: () => onNavigate('exams'),
    },
    {
      title: 'Clear Alerts',
      desc: 'Wipe system notifications',
      icon: <Trash2 className="w-4 h-4" />,
      color: 'from-slate-600 to-slate-800 dark:from-slate-700 dark:to-slate-900 shadow-slate-500/10',
      action: () => {
        clearNotifications();
        showToast('System alerts cleared', 'Inbox was emptied successfully.', 'info');
      },
    },
    {
      title: 'Leaderboard',
      desc: 'Review gold medalists',
      icon: <Award className="w-4 h-4" />,
      color: 'from-emerald-500 to-teal-500 shadow-emerald-500/10',
      action: () => onNavigate('leaderboard'),
    },
  ];

  return (
    <div className="p-5 rounded-3xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900 border border-slate-200/50 dark:border-slate-800/60 shadow-xl">
      <h4 className="text-xs font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4 text-indigo-500 animate-bounce" />
        <span>Action Command Center</span>
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((act, idx) => (
          <button
            key={idx}
            onClick={act.action}
            className="group relative overflow-hidden flex flex-col items-start p-3 text-left rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 hover:bg-slate-200/60 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800 transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-98"
          >
            <div className={`p-2 rounded-xl bg-gradient-to-br ${act.color} text-white mb-2 shadow-sm transition-transform group-hover:scale-110`}>
              {act.icon}
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {act.title}
            </span>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">
              {act.desc}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
