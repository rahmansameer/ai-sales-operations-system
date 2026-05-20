"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

type Status = "idle" | "success" | "error";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    setStatus("idle");

    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      await fetch(
        "https://survivor-ocelot-outback.ngrok-free.dev/webhook/lead-capture",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(payload),
        },
      );

      setStatus("success");
      form.reset();
    } catch (err) {
      console.log(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const buttonLabel = loading
    ? "Sending..."
    : status === "success"
      ? "Message sent"
      : status === "error"
        ? "Something went wrong"
        : "Send message";

  return (
    <section className="min-h-screen bg-[#f5f5f4] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[520px] bg-white border border-black/[0.07] rounded-xl p-10">
        <h2 className="text-[22px] font-medium tracking-tight text-zinc-900 mb-1.5">
          Get in touch
        </h2>
        <p className="text-[15px] text-zinc-500 leading-relaxed mb-7">
          We'll get back to you within 24 hours.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            required
            placeholder="Name"
            className="w-full h-12 px-4 rounded-lg border border-black/[0.08] bg-zinc-50 text-[15px] text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-black/25 transition"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="w-full h-12 px-4 rounded-lg border border-black/[0.08] bg-zinc-50 text-[15px] text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-black/25 transition"
          />
          <textarea
            name="message"
            required
            rows={6}
            placeholder="Message"
            className="w-full px-4 py-3 rounded-lg border border-black/[0.08] bg-zinc-50 text-[15px] text-zinc-900 placeholder:text-zinc-400 outline-none resize-none focus:border-black/25 transition leading-relaxed"
          />
          <button
            type="submit"
            disabled={loading || status === "success"}
            className="w-full cursor-pointer h-12 bg-zinc-900 hover:bg-zinc-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg text-[15px] font-medium flex items-center justify-center gap-2 transition"
          >
            <Send className="w-4 h-4" />
            {buttonLabel}
          </button>
        </form>
      </div>
    </section>
  );
}
