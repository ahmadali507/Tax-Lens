import Link from "next/link";
import { FileText, TrendingUp, Users, Upload, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col bg-background">
      {/* Hero Section with Background Image */}
      <section className="relative h-[600px] overflow-visible">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.2),transparent_50%)]" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground drop-shadow-lg sm:text-5xl md:text-6xl">
            See Where Your Taxes Go
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            A transparent platform empowering citizens with real-time insights into tax collection
            and government spending.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg hover-lift"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                View Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-border bg-transparent hover:bg-accent shadow-lg hover-lift"
            >
              <Link href="/upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Tax Slip
              </Link>
            </Button>
          </div>
        </div>

        {/* Overlapping Statistics Cards */}
        <div className="container absolute bottom-0 left-0 right-0 z-20 mx-auto px-4 translate-y-1/2 pb-2">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-0">
            {/* Card 1 */}
            <div className="group relative z-10 w-full sm:w-[280px] sm:-mr-8 md:-mr-12 rounded-lg border border-card-border glass p-6 shadow-xl transition-all duration-300 hover:z-30 hover:scale-105 hover:shadow-2xl hover:-translate-y-2">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                  <TrendingUp className="h-4 w-4 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Total Taxes Collected</span>
              </div>
              <h3 className="text-3xl font-bold text-primary transition-colors duration-300 group-hover:text-primary-hover">~2.1B</h3>
            </div>

            {/* Card 2 */}
            <div className="group relative z-20 w-full sm:w-[280px] sm:-mr-8 md:-mr-12 rounded-lg border border-card-border glass p-6 shadow-xl transition-all duration-300 hover:z-30 hover:scale-105 hover:shadow-2xl hover:-translate-y-2">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                  <FileText className="h-4 w-4 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Projects Funded</span>
              </div>
              <h3 className="text-3xl font-bold text-primary transition-colors duration-300 group-hover:text-primary-hover">150+</h3>
            </div>

            {/* Card 3 */}
            <div className="group relative z-10 w-full sm:w-[280px] rounded-lg border border-card-border glass p-6 shadow-xl transition-all duration-300 hover:z-30 hover:scale-105 hover:shadow-2xl hover:-translate-y-2">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                  <Users className="h-4 w-4 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Citizens Engaged</span>
              </div>
              <h3 className="text-3xl font-bold text-primary transition-colors duration-300 group-hover:text-primary-hover">50K+</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing for overlapping cards */}
      <div className="h-32 sm:h-40" />

      {/* Description Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-2xl font-semibold text-foreground sm:text-3xl">
            How it Works
          </h2>
          <p className="mx-auto max-w-3xl text-center text-base text-muted-foreground sm:text-lg">
            Empowering citizens with transparent data about tax collection and government spending
            through a simple three-step process
          </p>
        </div>
      </section>

      {/* Features Section with Numbered Cards */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="relative rounded-lg border border-card-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover-lift">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-md">
                  1
                </div>
              </div>
              <h3 className="mb-3 text-center text-xl font-bold text-card-foreground">
                Upload Tax Records
              </h3>
              <p className="text-center text-sm text-muted-foreground">
                Citizens contribute their tax payment records and receipts to build a crowdsourced
                database.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="relative rounded-lg border border-card-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover-lift">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-md">
                  2
                </div>
              </div>
              <h3 className="mb-3 text-center text-xl font-bold text-card-foreground">
                Track Collection
              </h3>
              <p className="text-center text-sm text-muted-foreground">
                View real-time data on tax collection across different sectors and categories.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="relative rounded-lg border border-card-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover-lift">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-md">
                  3
                </div>
              </div>
              <h3 className="mb-3 text-center text-xl font-bold text-card-foreground">
                Monitor Spending
              </h3>
              <p className="text-center text-sm text-muted-foreground">
                Compare tax inflows with government project budgets and expenditures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Gradient Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-hover py-20">
        {/* Decorative Circles */}
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full border-2 border-white/20" />
        <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full border-2 border-white/20" />
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-2 border-white/20" />
        <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full border-2 border-white/20" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white drop-shadow-sm md:text-4xl">
              Ready to Make a Difference?
            </h2>
            <p className="mb-8 text-lg text-white/95">
              Join thousands of citizens contributing to government transparency and accountability
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100 shadow-lg hover-lift"
              >
                <Link href="/register" className="flex items-center gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white bg-transparent text-white hover:bg-white/10 shadow-lg hover-lift"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
