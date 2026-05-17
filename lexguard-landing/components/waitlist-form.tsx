"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, ArrowRight, AlertCircle } from "lucide-react";
import { submitWaitlist } from "@/app/actions/waitlist";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});
type FormValues = z.infer<typeof schema>;

type State = "idle" | "submitting" | "success" | "error";

interface WaitlistFormProps {
  source?: "hero" | "cta";
  className?: string;
}

export function WaitlistForm({ source = "hero", className }: WaitlistFormProps) {
  const [state, setState] = useState<State>("idle");
  const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    setState("submitting");
    setServerError("");
    const result = await submitWaitlist(data.email, source);
    if (result.success) {
      setState("success");
    } else {
      setState("error");
      setServerError(result.error);
    }
  }

  if (state === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "flex items-center gap-3 px-5 py-4 rounded-xl border border-[#6366F1]/30 bg-[#6366F1]/10",
          className
        )}
      >
        <CheckCircle2 className="w-5 h-5 text-[#6366F1] flex-shrink-0" />
        <div>
          <p className="text-[#FAFAFA] text-sm font-medium">You&apos;re in. Watch your inbox.</p>
          <p className="text-[#888888] text-xs">We&apos;ll email you when LexGuard opens to beta.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("w-full", className)}>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <input
            {...register("email")}
            type="email"
            placeholder="you@company.com"
            disabled={state === "submitting"}
            className={cn(
              "w-full px-4 py-3 rounded-lg text-sm bg-[#0F0F0F] border text-[#FAFAFA] placeholder-[#555555]",
              "focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20",
              "transition-all duration-200 disabled:opacity-50",
              errors.email ? "border-red-500" : "border-[#1F1F1F] hover:border-[#2A2A2A]"
            )}
          />
        </div>
        <motion.button
          type="submit"
          disabled={state === "submitting"}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold",
            "bg-[#6366F1] hover:bg-[#7C7FF5] text-white",
            "shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:shadow-[0_0_40px_rgba(99,102,241,0.25)]",
            "transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
            "whitespace-nowrap"
          )}
        >
          {state === "submitting" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Joining...</span>
            </>
          ) : (
            <>
              <span>Join Waitlist</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
      <AnimatePresence>
        {(errors.email || state === "error") && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 mt-2"
          >
            <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-xs">
              {errors.email?.message ?? serverError}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
