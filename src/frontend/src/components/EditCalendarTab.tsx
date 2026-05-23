import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Clock, Edit2, Plus, Tag, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCalendarEvents } from "../hooks/useCalendarEvents";
import { useCreateEvent } from "../hooks/useCreateEvent";
import { useDeleteEvent } from "../hooks/useDeleteEvent";
import { useUpdateEvent } from "../hooks/useUpdateEvent";
import type { CalendarEvent, CreateEventInput } from "../types";

const CATEGORIES = ["Hackathon", "Workshop", "Meeting", "Social", "Other"];

const EMPTY_FORM: CreateEventInput = {
  subject: "",
  description: "",
  date: "",
  time: "",
  category: "Other",
};

function EventForm({
  initial,
  onSubmit,
  onCancel,
  isPending,
  title,
}: {
  initial: CreateEventInput;
  onSubmit: (input: CreateEventInput) => void;
  onCancel?: () => void;
  isPending: boolean;
  title: string;
}) {
  const [form, setForm] = useState<CreateEventInput>(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  function handleChange(field: keyof CreateEventInput, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.subject.trim() || !form.date) return;
    onSubmit(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-xl p-5 space-y-4"
    >
      <h3 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground">
        {title}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2 space-y-1.5">
          <Label
            htmlFor="ev-subject"
            className="text-xs font-display uppercase tracking-wider text-muted-foreground"
          >
            Subject <span className="text-destructive">*</span>
          </Label>
          <Input
            id="ev-subject"
            value={form.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            placeholder="e.g. Hackathon Kickoff"
            className="bg-muted/40 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/40 text-sm"
            data-ocid="calendar-form.subject_input"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="ev-date"
            className="text-xs font-display uppercase tracking-wider text-muted-foreground"
          >
            Date <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <Input
              id="ev-date"
              type="date"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="pl-9 bg-muted/40 border-border text-foreground focus-visible:ring-primary/40 text-sm"
              data-ocid="calendar-form.date_input"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="ev-time"
            className="text-xs font-display uppercase tracking-wider text-muted-foreground"
          >
            Time
          </Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <Input
              id="ev-time"
              type="time"
              value={form.time}
              onChange={(e) => handleChange("time", e.target.value)}
              className="pl-9 bg-muted/40 border-border text-foreground focus-visible:ring-primary/40 text-sm"
              data-ocid="calendar-form.time_input"
            />
          </div>
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <Label
            htmlFor="ev-category"
            className="text-xs font-display uppercase tracking-wider text-muted-foreground"
          >
            <Tag className="inline w-3 h-3 mr-1" />
            Category
          </Label>
          <select
            id="ev-category"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full h-9 rounded-md border border-border bg-muted/40 text-foreground px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
            data-ocid="calendar-form.category_select"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <Label
            htmlFor="ev-description"
            className="text-xs font-display uppercase tracking-wider text-muted-foreground"
          >
            Description
          </Label>
          <Textarea
            id="ev-description"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Brief description of the event…"
            rows={3}
            className="bg-muted/40 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/40 text-sm resize-none"
            data-ocid="calendar-form.description_textarea"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="border-border text-muted-foreground hover:text-foreground text-xs flex items-center gap-1.5"
            data-ocid="calendar-form.cancel_button"
          >
            <X className="w-3.5 h-3.5" /> Cancel
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={isPending || !form.subject.trim() || !form.date}
          className="btn-primary text-xs flex items-center gap-1.5"
          data-ocid="calendar-form.submit_button"
        >
          <Plus className="w-3.5 h-3.5" />
          {isPending ? "Saving…" : "Save Event"}
        </Button>
      </div>
    </form>
  );
}

function EventRow({
  event,
  index,
  onEdit,
  onDelete,
}: {
  event: CalendarEvent;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl bg-muted/20 border border-border/50 hover:border-primary/30 transition-colors group"
      data-ocid={`calendar-event.item.${index + 1}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-display font-semibold text-sm text-foreground truncate">
            {event.subject}
          </p>
          <span className="text-xs font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-md">
            {event.category}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground font-mono">
            {event.date}
          </span>
          {event.time && (
            <span className="text-xs text-muted-foreground font-mono">
              · {event.time}
            </span>
          )}
        </div>
        {event.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={onEdit}
          className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          aria-label={`Edit ${event.subject}`}
          data-ocid={`calendar-event.edit_button.${index + 1}`}
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          aria-label={`Delete ${event.subject}`}
          data-ocid={`calendar-event.delete_button.${index + 1}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function EditCalendarTab() {
  const { data: events = [], isLoading } = useCalendarEvents();
  const { mutate: createEvent, isPending: isCreating } = useCreateEvent();
  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent();
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();

  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<bigint | null>(null);
  const [formKey, setFormKey] = useState(0);

  function handleCreate(input: CreateEventInput) {
    createEvent(input, {
      onSuccess: () => setFormKey((k) => k + 1),
    });
  }

  function handleUpdate(input: CreateEventInput) {
    if (!editingEvent) return;
    updateEvent(
      { id: editingEvent.id, input },
      { onSuccess: () => setEditingEvent(null) },
    );
  }

  function handleDelete(id: bigint) {
    deleteEvent(id, { onSuccess: () => setConfirmDeleteId(null) });
  }

  const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Add / Edit form */}
      {editingEvent ? (
        <EventForm
          title="Edit Event"
          initial={{
            subject: editingEvent.subject,
            description: editingEvent.description,
            date: editingEvent.date,
            time: editingEvent.time,
            category: editingEvent.category,
          }}
          onSubmit={handleUpdate}
          onCancel={() => setEditingEvent(null)}
          isPending={isUpdating}
        />
      ) : (
        <EventForm
          key={`create-${formKey}`}
          title="Add New Event"
          initial={EMPTY_FORM}
          onSubmit={handleCreate}
          isPending={isCreating}
        />
      )}

      {/* Events list */}
      <div>
        <h3 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground mb-3">
          All Events
        </h3>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-muted/30 animate-pulse"
              />
            ))}
          </div>
        ) : sortedEvents.length === 0 ? (
          <div
            className="text-center py-10 border border-dashed border-border/50 rounded-xl"
            data-ocid="calendar-events.empty_state"
          >
            <CalendarIcon className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm font-mono">
              No events yet — add one above.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedEvents.map((ev, idx) => (
              <EventRow
                key={String(ev.id)}
                event={ev}
                index={idx}
                onEdit={() => {
                  setEditingEvent(ev);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onDelete={() => setConfirmDeleteId(ev.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation popup */}
      {confirmDeleteId !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          data-ocid="event-delete-confirm.dialog"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setConfirmDeleteId(null)}
            aria-label="Cancel"
          />
          <div className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl card-elevated p-6 text-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 bg-destructive/10">
              <Trash2 className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="font-display font-bold text-foreground text-base mb-2">
              Delete Event
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Are you sure you want to delete this event? This cannot be undone.
            </p>
            <div className="flex items-center gap-3 justify-center">
              <Button
                type="button"
                data-ocid="event-delete-confirm.cancel_button"
                variant="outline"
                size="sm"
                onClick={() => setConfirmDeleteId(null)}
                className="border-border text-muted-foreground hover:text-foreground text-xs flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                data-ocid="event-delete-confirm.confirm_button"
                size="sm"
                disabled={isDeleting}
                onClick={() => handleDelete(confirmDeleteId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs flex items-center gap-1.5 flex-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {isDeleting ? "Deleting…" : "Yes, Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
