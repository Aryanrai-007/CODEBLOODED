import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Lock,
  LockOpen,
  Search,
  ShieldCheck,
  Terminal,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useApplications } from "../hooks/useApplications";
import { useDeleteApplication } from "../hooks/useDeleteApplication";
import type { Application } from "../types";

// ─── Utilities ───────────────────────────────────────────────────────────────

function formatTimestamp(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  return new Date(ms).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ─── Passcode Lock Screen ─────────────────────────────────────────────────────

const CORRECT_PASSCODE = "RaiArya@ipec99";

function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  function handleUnlock() {
    if (passcode === CORRECT_PASSCODE) {
      setError("");
      onUnlock();
    } else {
      setError("Incorrect passcode. Please try again.");
      setShaking(true);
      setPasscode("");
      setTimeout(() => setShaking(false), 500);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleUnlock();
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-px flex-1 bg-border" />
          <Terminal className="w-4 h-4 text-primary" />
          <div className="h-px flex-1 bg-border" />
        </div>

        <div
          className={`bg-card border border-primary/25 rounded-xl p-8 card-elevated text-center transition-all duration-200 ${shaking ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
        >
          <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-5 bg-primary/12">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground mb-1 tracking-wider">
            ADMIN ACCESS
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Enter the passcode to access the admin dashboard.
          </p>

          <div className="flex flex-col gap-3">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                type="password"
                placeholder="Enter passcode…"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                className="pl-9 bg-muted/40 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/40 font-mono text-sm"
                data-ocid="passcode-input"
                autoComplete="off"
              />
            </div>

            {error && (
              <p
                className="text-xs text-destructive font-mono text-left"
                role="alert"
              >
                {error}
              </p>
            )}

            <Button
              data-ocid="unlock-btn"
              onClick={handleUnlock}
              className="w-full btn-primary flex items-center justify-center gap-2 h-11"
            >
              <LockOpen className="w-4 h-4" />
              Unlock Dashboard
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-5 font-mono">
            CODEX_LETHALIS · Admin Portal
          </p>
        </div>

        <div className="flex items-center gap-2 mt-6">
          <div className="h-px flex-1 bg-border" />
          <Terminal className="w-4 h-4 text-primary" />
          <div className="h-px flex-1 bg-border" />
        </div>
      </div>
    </div>
  );
}

// ─── Table Skeleton ───────────────────────────────────────────────────────────

const SKELETON_ROW_IDS = ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"];
const SKELETON_COL_IDS = ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9"];

function TableSkeleton() {
  return (
    <>
      {SKELETON_ROW_IDS.map((rowId) => (
        <TableRow key={rowId} className="border-border/40">
          {SKELETON_COL_IDS.map((colId) => (
            <TableCell key={`${rowId}-${colId}`}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ─── Application Row ─────────────────────────────────────────────────────────

function AppRow({
  app,
  index,
  onClick,
  onDelete,
}: {
  app: Application;
  index: number;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  return (
    <TableRow
      className="border-border/40 hover:bg-muted/20 transition-colors cursor-pointer"
      data-ocid={`application.item.${index + 1}`}
      onClick={onClick}
    >
      <TableCell className="text-muted-foreground font-mono text-xs w-10">
        {index + 1}
      </TableCell>
      <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
        {formatTimestamp(app.submittedAt)}
      </TableCell>
      <TableCell className="font-medium text-foreground whitespace-nowrap">
        {app.name}
      </TableCell>
      <TableCell className="whitespace-nowrap">
        <a
          href={`mailto:${app.email}`}
          className="text-primary transition-colors hover:opacity-80 text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {app.email}
        </a>
      </TableCell>
      <TableCell className="text-foreground whitespace-nowrap font-mono text-sm">
        {app.phone}
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className="border-border text-muted-foreground font-mono text-xs"
        >
          {app.yearOfStudy}
        </Badge>
      </TableCell>
      <TableCell className="text-foreground whitespace-nowrap text-sm">
        {app.department}
      </TableCell>
      <TableCell className="max-w-[220px]">
        <p className="text-foreground text-sm line-clamp-2 leading-relaxed">
          {app.reasonForJoining}
        </p>
      </TableCell>
      <TableCell className="max-w-[180px]">
        {app.priorExperience ? (
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {app.priorExperience}
          </p>
        ) : (
          <span className="italic text-muted-foreground/50 text-sm">None</span>
        )}
      </TableCell>
      <TableCell>
        <button
          type="button"
          data-ocid={`application.delete_button.${index + 1}`}
          aria-label={`Delete application from ${app.name}`}
          onClick={onDelete}
          className="p-1.5 rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </TableCell>
    </TableRow>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ onLock }: { onLock: () => void }) {
  const { data: applications = [], isLoading } = useApplications();
  const { mutate: deleteApplication, isPending: isDeleting } =
    useDeleteApplication();
  const [search, setSearch] = useState("");
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<bigint | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedApplication(null);
    }
    if (selectedApplication) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedApplication]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sorted = [...applications].sort((a, b) =>
      Number(b.submittedAt - a.submittedAt),
    );
    if (!q) return sorted;
    return sorted.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q),
    );
  }, [applications, search]);

  function handleRowDelete(app: Application, e: React.MouseEvent) {
    e.stopPropagation();
    deleteApplication(app.id);
  }

  const TABLE_HEADERS = [
    "#",
    "Date Submitted",
    "Full Name",
    "Email",
    "Phone",
    "Year",
    "Department",
    "Why They Want to Join",
    "Prior Experience",
    "",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header */}
      <header className="bg-card border-b border-primary/20 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Terminal className="w-5 h-5 flex-shrink-0 text-primary" />
            <span className="font-display font-bold text-foreground tracking-wider text-sm sm:text-base truncate">
              ADMIN DASHBOARD
            </span>
            <Badge
              data-ocid="submission-count"
              className="text-xs font-mono hidden sm:flex items-center gap-1 flex-shrink-0 bg-primary/12 text-primary border-primary/30"
              variant="outline"
            >
              <Users className="w-3 h-3" />
              {isLoading ? "…" : `${applications.length} applications`}
            </Badge>
          </div>

          <Button
            data-ocid="lock-btn"
            onClick={onLock}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-smooth text-xs flex-shrink-0"
          >
            <Lock className="w-3.5 h-3.5" />
            Lock
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display font-bold text-xl text-foreground tracking-wide">
              Member Applications
            </h2>
            <p className="text-muted-foreground text-sm mt-0.5">
              {isLoading
                ? "Loading submissions…"
                : `${filtered.length} of ${applications.length} shown`}
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              data-ocid="search-input"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/40"
            />
          </div>
        </div>

        {/* Table card */}
        <div className="bg-card border border-border rounded-xl overflow-hidden card-elevated">
          <div className="overflow-x-auto" data-ocid="applications-table">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 bg-muted/40">
                  {TABLE_HEADERS.map((col) => (
                    <TableHead
                      key={col}
                      className="text-muted-foreground font-display text-xs tracking-widest uppercase whitespace-nowrap py-3"
                    >
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton />
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="h-48 text-center"
                      data-ocid="empty-state"
                    >
                      <div className="flex flex-col items-center gap-3 py-8">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-muted/50">
                          <Users className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-display font-semibold text-foreground">
                            {search
                              ? "No matches found"
                              : "No applications yet"}
                          </p>
                          <p className="text-muted-foreground text-sm mt-1">
                            {search
                              ? "Try a different name or email address."
                              : "Submissions from the Join Now form will appear here."}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((app, i) => (
                    <AppRow
                      key={String(app.id)}
                      app={app}
                      index={i}
                      onClick={() => setSelectedApplication(app)}
                      onDelete={(e) => handleRowDelete(app, e)}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Mobile count */}
        {!isLoading && applications.length > 0 && (
          <p className="text-muted-foreground text-xs text-center mt-4 sm:hidden">
            {filtered.length} of {applications.length} applications
          </p>
        )}
      </main>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6"
          data-ocid="application-detail.dialog"
        >
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedApplication(null)}
            aria-label="Close modal"
          />

          {/* Modal card */}
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl card-elevated"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-card/95 backdrop-blur-sm">
              <div>
                <h3 className="font-display font-bold text-lg text-foreground tracking-wide">
                  Application Details
                </h3>
                <p className="text-muted-foreground text-xs mt-0.5 font-mono">
                  Submitted {formatTimestamp(selectedApplication.submittedAt)}
                </p>
              </div>
              <button
                type="button"
                data-ocid="application-detail.close_button"
                onClick={() => setSelectedApplication(null)}
                className="p-2 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-6">
              {/* Short fields grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                    Full Name
                  </p>
                  <p className="text-foreground font-medium">
                    {selectedApplication.name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                    Email
                  </p>
                  <a
                    href={`mailto:${selectedApplication.email}`}
                    className="text-primary hover:opacity-80 transition-colors font-medium"
                  >
                    {selectedApplication.email}
                  </a>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                    Phone
                  </p>
                  <p className="text-foreground font-mono text-sm">
                    {selectedApplication.phone}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                    Year of Study
                  </p>
                  <Badge
                    variant="outline"
                    className="border-border text-muted-foreground font-mono text-xs"
                  >
                    {selectedApplication.yearOfStudy}
                  </Badge>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                    Department
                  </p>
                  <p className="text-foreground">
                    {selectedApplication.department}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Long text fields */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                    Why They Want to Join
                  </p>
                  <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
                    <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedApplication.reasonForJoining}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                    Prior Experience
                  </p>
                  <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
                    {selectedApplication.priorExperience ? (
                      <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedApplication.priorExperience}
                      </p>
                    ) : (
                      <p className="italic text-muted-foreground/60 text-sm">
                        No prior experience provided.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 z-10 px-6 py-4 border-t border-border bg-card/95 backdrop-blur-sm flex items-center justify-between gap-3">
              {confirmDeleteId === selectedApplication.id ? (
                <>
                  <span className="text-xs text-destructive font-mono">
                    Confirm delete? This cannot be undone.
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      data-ocid="application-detail.cancel_button"
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmDeleteId(null)}
                      className="border-border text-muted-foreground hover:text-foreground text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      data-ocid="application-detail.confirm_button"
                      size="sm"
                      disabled={isDeleting}
                      onClick={() => {
                        deleteApplication(selectedApplication.id, {
                          onSuccess: () => {
                            setSelectedApplication(null);
                            setConfirmDeleteId(null);
                          },
                        });
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {isDeleting ? "Deleting…" : "Delete"}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    data-ocid="application-detail.delete_button"
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmDeleteId(selectedApplication.id)}
                    className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive/60 transition-smooth text-xs flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Application
                  </Button>
                  <Button
                    type="button"
                    data-ocid="application-detail.close_button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedApplication(null)}
                    className="border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-smooth text-xs"
                  >
                    Close
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />;
  }

  return <Dashboard onLock={() => setUnlocked(false)} />;
}
