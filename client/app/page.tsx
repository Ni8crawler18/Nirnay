import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Shield, Zap, BarChart, FileText, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-orange-600" />
            <span className="text-2xl font-bold">Nirnay</span>
          </div>
          <nav className="hidden gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Testimonials
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" className="hidden md:flex">
                Log in
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-orange-600 hover:bg-orange-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 bg-gradient-to-b from-white to-orange-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800">
                  Ministry of Broadcasting Initiative
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                    Safeguarding <span className="text-orange-600">Truth</span> in Live Media
                  </h1>
                  <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
                    Nirnay uses advanced AI to analyze live broadcasts in real-time and identify misinformation,
                    ensuring media integrity across India.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-2">
                    <div className="inline-block h-10 w-10 rounded-full border-2 border-background bg-orange-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="inline-block h-10 w-10 rounded-full border-2 border-background bg-orange-100 flex items-center justify-center">
                      <BarChart className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="inline-block h-10 w-10 rounded-full border-2 border-background bg-orange-100 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Trusted by media organizations across India</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[500px] w-full overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src="/broadcast_image.jpg"
                    alt="Nirnay Dashboard"
                    width={800}
                    height={1000}
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">Verified Content</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-20 border-t border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center rounded-full border px-4 py-1.5">
                <span className="text-sm font-medium">Built for Government & Media Organizations</span>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-10 py-10 md:grid-cols-5">
              <div className="flex items-center justify-center grayscale transition-all hover:grayscale-0">
                <Image src="/waves_logo.png?height=60&width=140" alt="Partner Logo" width={140} height={60} />
              </div>
              <div className="flex items-center justify-center grayscale transition-all hover:grayscale-0">
                <Image src="/MIB_logo.svg?height=60&width=140" alt="Partner Logo" width={140} height={60} />
              </div>
              <div className="flex items-center justify-center grayscale transition-all hover:grayscale-0">
                <Image src="/Truthtell_logo.png?height=60&width=140" alt="Partner Logo" width={140} height={60} />
              </div>
              <div className="flex items-center justify-center grayscale transition-all hover:grayscale-0">
                <Image src="/MHA_logo.svg?height=60&width=140" alt="Partner Logo" width={140} height={60} />
              </div>
              <div className="flex items-center justify-center grayscale transition-all hover:grayscale-0">
                <Image src="/NFSU_logo.png?height=60&width=140" alt="Partner Logo" width={140} height={60} />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-20 md:py-32 bg-orange-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800">
                Advanced Capabilities
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Comprehensive Media Verification
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Discover how Nirnay helps safeguard media integrity with cutting-edge technology
              </p>
            </div>
            <div className="mx-auto grid max-w-6xl gap-8 py-8 md:grid-cols-3">
              <div className="flex flex-col items-start space-y-4 rounded-xl border bg-white p-8 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-orange-100 p-4">
                  <Zap className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold">Real-Time Live Broadcast Analysis</h3>
                <p className="text-muted-foreground">
                  Process live broadcasts instantly with our advanced AI engine, providing immediate verification
                  results to combat misinformation as it happens.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground pt-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-600 shrink-0" />
                    <span>Processes content in seconds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-600 shrink-0" />
                    <span>Supports multiple languages</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-xl border bg-white p-8 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-orange-100 p-4">
                  <CheckCircle className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold">Fact Verification</h3>
                <p className="text-muted-foreground">
                  Cross-reference claims with our extensive database of trusted sources, ensuring accurate information
                  reaches the public.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground pt-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-600 shrink-0" />
                    <span>Access to verified databases</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-600 shrink-0" />
                    <span>Historical fact checking</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-xl border bg-white p-8 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-orange-100 p-4">
                  <Shield className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold">Confidence Scoring</h3>
                <p className="text-muted-foreground">
                  Our proprietary algorithm provides clear reliability indicators, helping viewers and organizations
                  assess content credibility at a glance.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground pt-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-600 shrink-0" />
                    <span>Transparent scoring system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-600 shrink-0" />
                    <span>Detailed verification reports</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="grid grid-cols-1 gap-6">
                  <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        1
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">Content Submission</h3>
                        <p className="text-muted-foreground">
                          Submit any live broadcast or recorded media through our secure platform for immediate
                          processing.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        2
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">AI Processing</h3>
                        <p className="text-muted-foreground">
                          Our advanced AI extracts audio, creates transcripts, and identifies key claims for
                          verification.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        3
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">Fact Verification</h3>
                        <p className="text-muted-foreground">
                          Claims are automatically checked against our extensive database of trusted sources and
                          fact-checking repositories.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        4
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">Comprehensive Results</h3>
                        <p className="text-muted-foreground">
                          Receive detailed reports with reliability scores, verified claims, and source citations for
                          complete transparency.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-8">
                <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800">
                  Streamlined Process
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How Nirnay Works</h2>
                <p className="text-lg text-muted-foreground">
                  Our advanced system processes content through multiple verification stages to ensure media integrity
                  and public trust.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                      Try It Now
                    </Button>
                  </Link>
                  <Link href="#testimonials">
                    <Button size="lg" variant="outline">
                      See Success Stories
                    </Button>
                  </Link>
                </div>
                <div className="relative h-[380px] w-full overflow-hidden rounded-2xl border shadow-md">
                  <Image
                    src="/workflow.png"
                    alt="Nirnay Process Diagram"
                    width={800}
                    height={600}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-20 md:py-32 bg-gradient-to-b from-orange-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800">
                Expected Impact
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Designed for Media Integrity
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                How Nirnay aims to transform media verification across India
              </p>
            </div>
            <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col justify-between rounded-xl border bg-white p-8 shadow-sm">
                <div className="space-y-4">
                  <div className="inline-flex items-center rounded-lg bg-orange-50 px-3 py-1 text-sm font-medium text-orange-800">
                    Broadcast Media
                  </div>
                  <p className="text-muted-foreground">
                    "Nirnay has the potential to transform how we verify information before broadcasting. The speed and
                    accuracy of real-time analysis could significantly improve our fact-checking processes."
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-4 pt-4 border-t">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="font-medium text-orange-600">DD</span>
                  </div>
                  <div>
                    <p className="font-medium">For organizations like Doordarshan</p>
                    <p className="text-sm text-muted-foreground">National Public Broadcaster</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-xl border bg-white p-8 shadow-sm">
                <div className="space-y-4">
                  <div className="inline-flex items-center rounded-lg bg-orange-50 px-3 py-1 text-sm font-medium text-orange-800">
                    Radio Broadcasting
                  </div>
                  <p className="text-muted-foreground">
                    "The analytics capabilities of Nirnay could be invaluable for our editorial team. We would be able
                    to make data-driven decisions about content verification and build greater audience trust."
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-4 pt-4 border-t">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="font-medium text-orange-600">AIR</span>
                  </div>
                  <div>
                    <p className="font-medium">For organizations like All India Radio</p>
                    <p className="text-sm text-muted-foreground">National Radio Broadcaster</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-xl border bg-white p-8 shadow-sm">
                <div className="space-y-4">
                  <div className="inline-flex items-center rounded-lg bg-orange-50 px-3 py-1 text-sm font-medium text-orange-800">
                    Regulatory Bodies
                  </div>
                  <p className="text-muted-foreground">
                    "As a regulatory initiative, Nirnay could drive a marked improvement in broadcast quality across
                    member organizations. This tool has the potential to be truly transformative for media integrity."
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-4 pt-4 border-t">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="font-medium text-orange-600">MIB</span>
                  </div>
                  <div>
                    <p className="font-medium">For the Ministry of Information & Broadcasting</p>
                    <p className="text-sm text-muted-foreground">Government of India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-20 md:py-32 bg-orange-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
                  Join India's Fight Against Misinformation
                </h2>
                <p className="text-lg text-blue-100 mb-8">
                  Nirnay is committed to preserving media integrity and public trust. Start your journey towards
                  verified, reliable broadcasting today.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" variant="secondary">
                      Get Started Now
                    </Button>
                  </Link>
                  <Link href="#contact">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-white border-white hover:bg-orange-700 relative overflow-hidden group"
                    >
                      <span className="relative z-10">Contact Our Team</span>
                      <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform"></span>
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-orange-500 opacity-50"></div>
                <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-orange-700 opacity-50"></div>
                <div className="relative rounded-2xl bg-white/10 backdrop-blur-sm p-8 shadow-lg">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Shield className="h-10 w-10 text-white" />
                      <div>
                        <h3 className="text-xl font-bold">Verified Content</h3>
                        <p className="text-blue-100">Across all media channels</p>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-orange-700">
                      <div className="h-2 rounded-full bg-white" style={{ width: "87%" }}></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Current Trust Score</span>
                      <span className="font-bold">87%</span>
                    </div>
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-white/10 p-4">
                      <div className="text-3xl font-bold">1200+</div>
                      <div className="text-sm text-blue-100">Media Sources</div>
                    </div>
                    <div className="rounded-lg bg-white/10 p-4">
                      <div className="text-3xl font-bold">24/7</div>
                      <div className="text-sm text-blue-100">Monitoring</div>
                    </div>
                    <div className="rounded-lg bg-white/10 p-4">
                      <div className="text-3xl font-bold">98%</div>
                      <div className="text-sm text-blue-100">Accuracy</div>
                    </div>
                    <div className="rounded-lg bg-white/10 p-4">
                      <div className="text-3xl font-bold">15+</div>
                      <div className="text-sm text-blue-100">Languages</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-slate-50">
        <div className="container py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-orange-600" />
                <span className="text-xl font-bold">Nirnay</span>
              </div>
              <p className="text-sm text-muted-foreground">
                India's premier platform for media verification and fact-checking, supporting the Ministry of
                Broadcasting's mission for truthful information.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12 0 6.627 5.373 12 12 12 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                  </svg>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Media Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="text-muted-foreground mt-0.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm text-muted-foreground">
                    Nirnay, Bannari Amman Institute of Technology, Sathyamangalam, Tamil Nadu, India
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="text-muted-foreground mt-0.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-muted-foreground">contact@nirnay.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="text-muted-foreground mt-0.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-sm text-muted-foreground">+91 8668135371</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Nirnay. All rights reserved. A Ministry of Broadcasting Initiative.
            </p>
            <div className="flex gap-8">
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

