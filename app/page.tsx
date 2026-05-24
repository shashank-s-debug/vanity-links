import Link from "next/link";
import { getSession } from "@/lib/session";
import { ArrowRight, Link2, BarChart2, Zap } from "lucide-react";

export default async function LandingPage() {
  const session = await getSession();

  return (
    <div className="flex flex-col min-h-full">
      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-lg text-indigo-600">VanityLinks</span>
          <div className="flex items-center gap-3">
            {session.userId ? (
              <Link
                href="/dashboard"
                className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign up free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wide">
            Custom vanity URLs
          </span>
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-5">
            Replace ugly links with{" "}
            <span className="text-indigo-600">clean, memorable URLs</span>
          </h1>
          <p className="text-lg text-gray-500 mb-10 leading-relaxed">
            Turn any long destination link into a short branded slug that&apos;s easy to share,
            remember, and track.
          </p>

          {/* Before / After */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-10 text-left shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">See the difference</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="shrink-0 text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded">Before</span>
                <code className="text-sm text-gray-500 font-mono truncate">
                  https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit
                </code>
              </div>
              <div className="flex items-center gap-3">
                <span className="shrink-0 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">After</span>
                <code className="text-sm text-indigo-600 font-mono font-semibold">
                  yoursite.com/go/q4-report
                </code>
              </div>
            </div>
          </div>

          <Link
            href={session.userId ? "/dashboard/new" : "/register"}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-700 transition-colors text-lg shadow-md"
          >
            Create your first link <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Everything you need</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Link2 className="w-6 h-6 text-indigo-600" />}
              title="Custom slugs"
              description="Choose a slug that makes sense for your link — like /go/pricing or /go/join-us."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-indigo-600" />}
              title="Instant redirects"
              description="Visitors are silently forwarded to your destination URL in milliseconds."
            />
            <FeatureCard
              icon={<BarChart2 className="w-6 h-6 text-indigo-600" />}
              title="Click tracking"
              description="Every visit increments a counter so you always know how often your links are used."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How it works</h2>
          <ol className="space-y-8">
            {[
              { step: "1", title: "Sign up for free", body: "Create an account with just your email and a password." },
              { step: "2", title: "Create a vanity link", body: "Pick a slug and paste the destination URL. Preview your clean link as you type." },
              { step: "3", title: "Share it anywhere", body: "Copy your vanity URL and share it. Every visitor is redirected instantly." },
            ].map((item) => (
              <li key={item.step} className="flex gap-5 items-start">
                <span className="shrink-0 w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                  {item.step}
                </span>
                <div>
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-gray-500 text-sm mt-1">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} VanityLinks
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-start p-6 rounded-xl border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow">
      <div className="w-11 h-11 rounded-lg bg-indigo-50 flex items-center justify-center mb-4">{icon}</div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
