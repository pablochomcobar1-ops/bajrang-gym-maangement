import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

function Landing() {
  const features = [
    {
      title: "AI Workout Plans",
      desc: "Personalized workout and diet plans generated instantly, tailored to your goals and experience.",
    },
    {
      title: "Progress Tracking",
      desc: "Log your weight, set goals, and see your muscle-group balance over time with real charts.",
    },
    {
      title: "Expert Trainers",
      desc: "Book appointments and get plans assigned directly by real trainers and dieticians.",
    },
    {
      title: "Digital Gym ID",
      desc: "A unique QR-based ID for fast check-in — no cards, no waiting.",
    },
  ];

  return (
    <div className="min-h-screen bg-base relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-accent-violet/20 rounded-full blur-[120px] -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-accent-lime/10 rounded-full blur-[120px] top-40 -right-20" />

      {/* Nav */}
      <nav className="relative flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Bajrang GYM"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-display text-text font-bold text-xl">
            Bajrang GYM
          </span>
        </div>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="text-text-muted hover:text-text px-4 py-2 rounded-xl transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-gradient-to-r from-accent-violet to-accent-pink text-white px-4 py-2 rounded-xl font-medium hover:brightness-110 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-3xl mx-auto text-center px-4 pt-16 pb-24"
      >
        <h1 className="font-display text-5xl md:text-6xl font-bold text-text mb-6 leading-tight">
          Train smarter with{" "}
          <span className="text-accent-violet">AI-powered</span> fitness
        </h1>
        <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto">
          Bajrang GYM combines expert trainers with AI-driven plans, real
          progress tracking, and a seamless digital experience — all in one
          place.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="bg-gradient-to-r from-accent-violet to-accent-pink text-white px-8 py-3 rounded-xl font-semibold hover:brightness-110 transition active:scale-[0.98]"
          >
            Join Now
          </Link>
          <Link
            to="/login"
            className="bg-surface-light text-text px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition border border-white/10"
          >
            I have an account
          </Link>
        </div>
      </motion.div>

      {/* Features */}
      <div className="relative max-w-5xl mx-auto px-4 pb-24 grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl"
          >
            <h3 className="font-display text-xl font-bold text-text mb-2">
              {f.title}
            </h3>
            <p className="text-text-muted text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* QR Code */}
      <div className="relative max-w-sm mx-auto text-center px-4 pb-16">
        <div className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl inline-block">
          <div className="bg-white p-3 rounded-xl inline-block mb-3">
            <QRCodeSVG
              value="https://bajrang-gym-maangement.vercel.app"
              size={140}
            />
          </div>
          <p className="text-text-muted text-sm">Scan to visit on your phone</p>
        </div>
      </div>

      {/* Contact */}
      <div className="relative max-w-3xl mx-auto px-4 pb-16">
        <div className="bg-surface/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl">
          <h2 className="font-display text-2xl font-bold text-text mb-6 text-center">
            Visit Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-accent-lime text-sm font-semibold mb-1">
                Address
              </p>
              <p className="text-text-muted text-sm">
                3rd Floor, Nandani Plaza,
                <br />
                Modasa Road, Kapadvanj
                <br />
                387620
              </p>
            </div>
            <div>
              <p className="text-accent-lime text-sm font-semibold mb-1">
                Phone
              </p>
              <a
                href="tel:+917622034124"
                className="text-text-muted text-sm hover:text-text transition"
              >
                +91 76220 34124
              </a>
            </div>
            <div>
              <p className="text-accent-lime text-sm font-semibold mb-1">
                Email
              </p>
              <a
                href="mailto:bajranggym2210@gmail.com"
                className="text-text-muted text-sm hover:text-text transition break-all"
              >
                bajranggym2210@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative text-center text-text-muted text-sm pb-8">
        © {new Date().getFullYear()} Bajrang GYM. All rights reserved.
      </footer>
    </div>
  );
}

export default Landing;
