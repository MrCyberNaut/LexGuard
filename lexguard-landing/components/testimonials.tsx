"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Caught an IP clause my lawyer missed. The pushback language worked verbatim.",
    name: "Senior Engineer",
    role: "Fintech startup",
  },
  {
    quote: "I read NDAs for a living. LexGuard surfaces the same things in 10 seconds.",
    name: "Contract Attorney",
    role: "NYC",
  },
  {
    quote: "The pushback email worked. They changed the non-compete scope same day.",
    name: "Product Designer",
    role: "Freelance",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
          className="text-[#6366F1] text-xs font-medium uppercase tracking-widest mb-4 text-center"
        >
          Early access
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display font-semibold text-3xl md:text-5xl text-[#FAFAFA] text-center mb-16 leading-[1.1]"
        >
          It works. Ask these people.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group p-6 rounded-xl bg-[#0F0F0F] border border-[#1F1F1F] hover:border-[#2A2A2A] transition-all duration-300 flex flex-col"
            >
              <Quote className="w-5 h-5 text-[#6366F1] mb-4 opacity-60" />
              <p className="text-[#FAFAFA] text-sm leading-relaxed flex-1 mb-6">
                &quot;{t.quote}&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#6366F1]/20 flex items-center justify-center text-[#6366F1] text-xs font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-[#888888] text-xs font-medium">{t.name}</p>
                  <p className="text-[#555555] text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
