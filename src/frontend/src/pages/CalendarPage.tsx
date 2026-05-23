import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Tag,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCalendarEvents } from "../hooks/useCalendarEvents";
import type { CalendarEvent } from "../types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SKELETON_CELL_IDS = Array.from(
  { length: 35 },
  (_, i) => `skeleton-cell-${i}`,
);
const GRID_CELL_IDS = Array.from({ length: 42 }, (_, i) => `grid-cell-${i}`);

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function categoryColor(category: string) {
  const map: Record<string, string> = {
    Hackathon: "text-cyan-400",
    Workshop: "text-purple-400",
    Meeting: "text-amber-400",
    Social: "text-emerald-400",
    Other: "text-muted-foreground",
  };
  return map[category] ?? "text-muted-foreground";
}

function EventTooltip({ events }: { events: CalendarEvent[] }) {
  return (
    <div className="calendar-event-tooltip absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-xl p-3 shadow-2xl pointer-events-none">
      <div className="space-y-3">
        {events.map((ev) => (
          <div key={String(ev.id)} className="space-y-1">
            <p className="font-display font-semibold text-sm text-foreground leading-tight">
              {ev.subject}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {ev.time && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                  <Clock className="w-3 h-3" />
                  {ev.time}
                </span>
              )}
              {ev.category && (
                <span
                  className={`flex items-center gap-1 text-xs font-mono ${categoryColor(ev.category)}`}
                >
                  <Tag className="w-3 h-3" />
                  {ev.category}
                </span>
              )}
            </div>
            {ev.description && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {ev.description}
              </p>
            )}
          </div>
        ))}
      </div>
      {/* Tooltip arrow */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white/10" />
    </div>
  );
}

function EventDetailModal({
  events,
  dateKey,
  onClose,
}: {
  events: CalendarEvent[];
  dateKey: string;
  onClose: () => void;
}) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6"
      data-ocid="calendar-event-detail.dialog"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto calendar-glass rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg text-foreground tracking-wide">
            {dateKey}
          </h3>
          <button
            type="button"
            data-ocid="calendar-event-detail.close_button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {events.map((ev, idx) => (
            <div
              key={String(ev.id)}
              className="p-4 rounded-xl bg-muted/20 border border-border/50 space-y-2"
              data-ocid={`calendar-event-detail.item.${idx + 1}`}
            >
              <p className="font-display font-semibold text-foreground">
                {ev.subject}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                {ev.time && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                    <Clock className="w-3 h-3" />
                    {ev.time}
                  </span>
                )}
                {ev.category && (
                  <span
                    className={`flex items-center gap-1 text-xs font-mono ${categoryColor(ev.category)}`}
                  >
                    <Tag className="w-3 h-3" />
                    {ev.category}
                  </span>
                )}
              </div>
              {ev.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {ev.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DayCell({
  day,
  dateKey,
  events,
  isToday,
  onClick,
}: {
  day: number;
  dateKey: string;
  events: CalendarEvent[];
  isToday: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const hasEvents = events.length > 0;

  return (
    <button
      type="button"
      className={`relative min-h-[72px] sm:min-h-[90px] p-1.5 sm:p-2 rounded-lg transition-colors duration-150 group text-left w-full ${
        hasEvents ? "calendar-day-event cursor-pointer" : "hover:bg-muted/20"
      } ${isToday ? "ring-1 ring-primary/50" : ""}`}
      onMouseEnter={() => hasEvents && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => hasEvents && onClick()}
      disabled={!hasEvents}
      data-ocid={`calendar.day.${dateKey}`}
    >
      <span
        className={`text-xs font-mono ${
          isToday
            ? "font-bold text-primary"
            : hasEvents
              ? "text-foreground"
              : "text-muted-foreground"
        }`}
      >
        {day}
      </span>
      {hasEvents && (
        <div className="mt-1 flex flex-wrap gap-0.5">
          {events.slice(0, 3).map((ev) => (
            <span
              key={String(ev.id)}
              className="block w-1.5 h-1.5 rounded-full bg-primary/80"
            />
          ))}
          {events.length > 3 && (
            <span className="text-[9px] text-primary font-mono">
              +{events.length - 3}
            </span>
          )}
        </div>
      )}
      {hasEvents && hovered && <EventTooltip events={events} />}
    </button>
  );
}

export function CalendarPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const { data: events = [], isLoading } = useCalendarEvents();
  const [selectedDateEvents, setSelectedDateEvents] = useState<
    CalendarEvent[] | null
  >(null);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const eventsByDate = events.reduce<Record<string, CalendarEvent[]>>(
    (acc, ev) => {
      if (!acc[ev.date]) acc[ev.date] = [];
      acc[ev.date].push(ev);
      return acc;
    },
    {},
  );

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else setViewMonth((m) => m + 1);
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  const todayKey = toDateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const upcomingEvents = [...events]
    .filter((ev) => ev.date >= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary" />
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground tracking-wide">
                समय <span className="text-primary">CODEX</span>
              </h1>
              <p className="text-muted-foreground text-sm font-mono mt-0.5">
                Club events & schedule — CODEX_LETHALIS
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Calendar Grid */}
          <div
            className="calendar-glass rounded-2xl p-4 sm:p-6"
            data-ocid="calendar.panel"
          >
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                onClick={prevMonth}
                className="p-2 rounded-lg hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Previous month"
                data-ocid="calendar.pagination_prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="font-display font-bold text-lg sm:text-xl text-foreground tracking-wide">
                {MONTHS[viewMonth]}{" "}
                <span className="text-primary font-mono">{viewYear}</span>
              </h2>
              <button
                type="button"
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Next month"
                data-ocid="calendar.pagination_next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-2">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Day cells */}
            {isLoading ? (
              <div className="grid grid-cols-7 gap-1">
                {SKELETON_CELL_IDS.map((cellId) => (
                  <div
                    key={cellId}
                    className="min-h-[72px] rounded-lg bg-muted/30 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {GRID_CELL_IDS.slice(0, totalCells).map((cellId, i) => {
                  const day = i - firstDay + 1;
                  const isCurrentMonth = day >= 1 && day <= daysInMonth;
                  if (!isCurrentMonth) {
                    return (
                      <div
                        key={cellId}
                        className="min-h-[72px] sm:min-h-[90px]"
                      />
                    );
                  }
                  const dateKey = toDateKey(viewYear, viewMonth, day);
                  const dayEvents = eventsByDate[dateKey] ?? [];
                  const isToday = dateKey === todayKey;
                  return (
                    <DayCell
                      key={dateKey}
                      day={day}
                      dateKey={dateKey}
                      events={dayEvents}
                      isToday={isToday}
                      onClick={() => {
                        setSelectedDateEvents(dayEvents);
                        setSelectedDateKey(dateKey);
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar: Upcoming Events */}
          <div className="space-y-4">
            <div
              className="calendar-glass rounded-2xl p-4 sm:p-5"
              data-ocid="calendar.upcoming-section"
            >
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">
                Upcoming Events
              </h3>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-14 rounded-lg bg-muted/30 animate-pulse"
                    />
                  ))}
                </div>
              ) : upcomingEvents.length === 0 ? (
                <div
                  className="text-center py-6"
                  data-ocid="calendar.empty_state"
                >
                  <Calendar className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-muted-foreground text-xs font-mono">
                    No upcoming events
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((ev, idx) => (
                    <div
                      key={String(ev.id)}
                      className="p-3 rounded-xl bg-muted/20 border border-border/50 hover:border-primary/30 transition-colors"
                      data-ocid={`calendar.upcoming.item.${idx + 1}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-display font-semibold text-sm text-foreground leading-tight truncate">
                          {ev.subject}
                        </p>
                        <span
                          className={`text-xs font-mono flex-shrink-0 ${categoryColor(ev.category)}`}
                        >
                          {ev.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground font-mono">
                          {ev.date}
                        </span>
                        {ev.time && (
                          <span className="text-xs text-muted-foreground font-mono">
                            · {ev.time}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Legend */}
            <div
              className="calendar-glass rounded-2xl p-4"
              data-ocid="calendar.legend"
            >
              <h3 className="font-display font-bold text-xs uppercase tracking-widest text-muted-foreground mb-3">
                Categories
              </h3>
              <div className="space-y-2">
                {["Hackathon", "Workshop", "Meeting", "Social", "Other"].map(
                  (cat) => (
                    <div key={cat} className="flex items-center gap-2">
                      <span
                        className={`text-xs font-mono ${categoryColor(cat)}`}
                      >
                        ◆
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {cat}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedDateEvents && selectedDateKey && (
        <EventDetailModal
          events={selectedDateEvents}
          dateKey={selectedDateKey}
          onClose={() => {
            setSelectedDateEvents(null);
            setSelectedDateKey(null);
          }}
        />
      )}
    </div>
  );
}
