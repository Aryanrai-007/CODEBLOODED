import { CheckCircle2, ChevronDown, Loader2, Terminal } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useSubmitApplication } from "../hooks/useSubmitApplication";
import type { SubmitApplicationInput } from "../types";

const YEAR_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Other",
] as const;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-xs text-destructive font-mono" role="alert">
      {message}
    </p>
  );
}

function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-6 py-16 px-6 text-center"
      data-ocid="join-success"
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-150" />
        <CheckCircle2
          className="relative w-20 h-20 text-primary"
          strokeWidth={1.5}
        />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-display font-bold accent-text-gradient">
          Application Submitted!
        </h2>
        <p className="text-muted-foreground max-w-sm">
          Welcome to the crew. We've received your application and will review
          it shortly. Stay sharp — big things are coming.
        </p>
      </div>
      <div className="flex items-center gap-2 bg-muted/60 border border-border rounded-lg px-4 py-3 font-mono text-sm text-muted-foreground">
        <Terminal className="w-4 h-4 text-primary" />
        <span>
          status:{" "}
          <span className="text-primary font-semibold">PENDING_REVIEW</span>
        </span>
      </div>
      <Button
        type="button"
        onClick={onReset}
        variant="outline"
        className="mt-2 border-primary/40 text-primary hover:bg-primary/10 font-mono"
        data-ocid="join-submit-another"
      >
        Submit Another Application
      </Button>
    </div>
  );
}

export function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const { mutate, isPending } = useSubmitApplication();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmitApplicationInput>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      yearOfStudy: "",
      department: "",
      reasonForJoining: "",
      priorExperience: "",
    },
  });

  const onSubmit = (data: SubmitApplicationInput) => {
    mutate(data, {
      onSuccess: (result) => {
        if (result.__kind__ === "err") {
          toast.error("Submission failed", { description: result.err });
          return;
        }
        setSubmitted(true);
      },
      onError: (err) => {
        toast.error("Something went wrong", {
          description: err.message || "Please try again.",
        });
      },
    });
  };

  const inputBase =
    "bg-muted/40 border-border focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-foreground placeholder:text-muted-foreground transition-smooth font-mono text-sm";

  const selectBase =
    "flex h-10 w-full rounded-md border px-3 py-2 pr-9 appearance-none text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary bg-muted/40 border-border text-foreground font-mono";

  return (
    <div className="min-h-screen bg-background">
      {/* Page hero header */}
      <div className="relative border-b border-border bg-card overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
        <div className="absolute -top-16 left-1/4 w-72 h-72 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 right-1/4 w-56 h-56 rounded-full bg-secondary/8 blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-6 py-14 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary font-mono text-xs tracking-widest uppercase">
              Applications Open
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">
            Join Our{" "}
            <span className="accent-text-gradient">Hackathon Club</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
            Be part of a community that builds, breaks, and ships. Fill out the
            form below and we'll be in touch.
          </p>
        </div>
      </div>

      {/* Form container */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="card-elevated accent-glow bg-card border border-border rounded-2xl overflow-hidden">
          {submitted ? (
            <SuccessScreen
              onReset={() => {
                reset();
                setSubmitted(false);
              }}
            />
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-8 space-y-6"
              noValidate
              data-ocid="join-form"
            >
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold font-mono tracking-widest uppercase text-muted-foreground">
                    Full Name <span className="text-primary">*</span>
                  </Label>
                  <Input
                    placeholder="Your full name"
                    className={inputBase}
                    data-ocid="join-input-name"
                    aria-invalid={!!errors.name}
                    {...register("name", {
                      required: "Full name is required",
                      minLength: { value: 2, message: "At least 2 characters" },
                    })}
                  />
                  <FieldError message={errors.name?.message} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold font-mono tracking-widest uppercase text-muted-foreground">
                    Email Address <span className="text-primary">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className={inputBase}
                    data-ocid="join-input-email"
                    aria-invalid={!!errors.email}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                  />
                  <FieldError message={errors.email?.message} />
                </div>
              </div>

              {/* Phone + Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold font-mono tracking-widest uppercase text-muted-foreground">
                    Phone Number <span className="text-primary">*</span>
                  </Label>
                  <Input
                    type="tel"
                    placeholder="Your phone number"
                    className={inputBase}
                    data-ocid="join-input-phone"
                    aria-invalid={!!errors.phone}
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[+\d\s\-()]{7,20}$/,
                        message: "Enter a valid phone number",
                      },
                    })}
                  />
                  <FieldError message={errors.phone?.message} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold font-mono tracking-widest uppercase text-muted-foreground">
                    Year of Study <span className="text-primary">*</span>
                  </Label>
                  <div className="relative">
                    <select
                      className={selectBase}
                      data-ocid="join-select-year"
                      aria-invalid={!!errors.yearOfStudy}
                      {...register("yearOfStudy", {
                        required: "Please select your year of study",
                      })}
                    >
                      <option value="">Select year…</option>
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  <FieldError message={errors.yearOfStudy?.message} />
                </div>
              </div>

              {/* Department */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold font-mono tracking-widest uppercase text-muted-foreground">
                  Department / Major <span className="text-primary">*</span>
                </Label>
                <Input
                  placeholder="e.g. Computer Science"
                  className={inputBase}
                  data-ocid="join-input-department"
                  aria-invalid={!!errors.department}
                  {...register("department", {
                    required: "Department is required",
                    minLength: { value: 2, message: "At least 2 characters" },
                  })}
                />
                <FieldError message={errors.department?.message} />
              </div>

              {/* Reason for joining */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold font-mono tracking-widest uppercase text-muted-foreground">
                  Why do you want to join?{" "}
                  <span className="text-primary">*</span>
                </Label>
                <Textarea
                  placeholder="I want to collaborate with brilliant minds, build real-world projects, and push my skills beyond the classroom…"
                  className={`${inputBase} resize-none min-h-[110px]`}
                  data-ocid="join-textarea-reason"
                  aria-invalid={!!errors.reasonForJoining}
                  {...register("reasonForJoining", {
                    required: "Please tell us why you want to join",
                    minLength: {
                      value: 30,
                      message: "Please write at least 30 characters",
                    },
                  })}
                />
                <FieldError message={errors.reasonForJoining?.message} />
              </div>

              {/* Prior experience (optional) */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold font-mono tracking-widest uppercase text-muted-foreground">
                  Prior Experience{" "}
                  <span className="text-muted-foreground/60 normal-case font-normal">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  placeholder="Hackathons, open-source projects, internships, personal projects…"
                  className={`${inputBase} resize-none min-h-[90px]`}
                  data-ocid="join-textarea-experience"
                  {...register("priorExperience")}
                />
              </div>

              {/* Divider + submit row */}
              <div className="border-t border-border pt-6 flex items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground font-mono">
                  <span className="text-primary">*</span> Required fields
                </p>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="btn-primary min-w-[180px] flex items-center gap-2"
                  data-ocid="join-submit"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
