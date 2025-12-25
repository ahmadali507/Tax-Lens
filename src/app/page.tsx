import Link from "next/link";
import { FileText, TrendingUp, Users, Upload, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Home as HomeIcon, LayoutDashboard, Upload as UploadIcon } from "lucide-react";
import Image from "next/image";
import { PageBackground } from "@/components/ui/page-background";

export default function Home() {
  return (
    <PageBackground>
      <div className="flex flex-col">
        {/* Hero Section with HeroHighlight */}
        <div className="relative h-[30rem] sm:h-[35rem] md:h-[40rem] flex items-center justify-center w-full group overflow-hidden">
           {/* Background Image with Overlay */}
           <div className="absolute inset-0 z-0">
            {/* Day Mode Image */}
            <Image
              src="/hero-cityscape-day.png"
              alt="City skyline day"
              fill
              className="object-cover block dark:hidden opacity-100"
              priority
            />
            {/* Night Mode Image */}
            <Image
              src="/hero-cityscape-night.jpg"
              alt="City skyline night"
              fill
              className="object-cover hidden dark:block opacity-100"
              priority
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-white/20 dark:bg-black/40 sm:bg-white/10" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background dark:via-black/20" />
          </div>

          <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-800 dark:text-white max-w-4xl leading-relaxed lg:leading-snug mb-4 sm:mb-6 drop-shadow-sm">
              See Where Your <Highlight className="text-black dark:text-white">Taxes Go</Highlight>
            </h1>
            <p className="mb-6 sm:mb-8 text-base sm:text-lg text-neutral-700 dark:text-neutral-200 md:text-xl max-w-2xl mx-auto font-medium px-2">
              A transparent platform empowering citizens with real-time insights into tax collection
              and government spending.
            </p>
            <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row justify-center px-4">
              <Button
                asChild
                size="lg"
                className="bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 shadow-lg hover-lift border border-transparent min-h-[44px] w-full sm:w-auto"
              >
                <Link href="/dashboard" className="flex items-center justify-center gap-2">
                  View Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/50 text-black border-neutral-200 hover:bg-white/80 dark:bg-black/50 dark:text-white dark:border-neutral-800 backdrop-blur-sm dark:hover:bg-black/80 shadow-lg hover-lift min-h-[44px] w-full sm:w-auto"
              >
                <Link href="/upload" className="flex items-center justify-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Tax Slip
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Section with BentoGrid */}
        <section className="py-8 sm:py-12 relative z-10 -mt-16 sm:-mt-20">
          <div className="container mx-auto px-4 sm:px-6">
            <BentoGrid className="max-w-4xl mx-auto">
              <BentoGridItem
                title="Total Taxes Collected"
                description="Real-time tracking of tax contributions across all sectors."
                header={
                  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 items-center justify-center glass glass-border">
                    <span className="text-4xl font-bold text-primary">~2.1B</span>
                  </div>
                }
                icon={<TrendingUp className="h-4 w-4 text-neutral-500" />}
                className="md:col-span-1 glass glass-border"
              />
              <BentoGridItem
                title="Projects Funded"
                description="Government projects currently funded by tax revenue."
                header={
                  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 items-center justify-center glass glass-border">
                    <span className="text-4xl font-bold text-secondary-foreground">150+</span>
                  </div>
                }
                icon={<FileText className="h-4 w-4 text-neutral-500" />}
                className="md:col-span-1 glass glass-border"
              />
              <BentoGridItem
                title="Citizens Engaged"
                description="Active citizens contributing to transparency."
                header={
                  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 items-center justify-center glass glass-border">
                    <span className="text-4xl font-bold text-accent-foreground">50K+</span>
                  </div>
                }
                icon={<Users className="h-4 w-4 text-neutral-500" />}
                className="md:col-span-1 glass glass-border"
              />
            </BentoGrid>
          </div>
        </section>

        {/* Spacing for overlapping cards */}
        <div className="h-32 sm:h-40" />

        {/* Description Section */}
        <section className="py-12">
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
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="relative rounded-lg border border-card-border bg-card/50 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover-lift glass glass-border">
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
              <div className="relative rounded-lg border border-card-border bg-card/50 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover-lift glass glass-border">
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
              <div className="relative rounded-lg border border-card-border bg-card/50 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover-lift glass glass-border">
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
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full border-2 border-primary-foreground/20" />
          <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full border-2 border-primary-foreground/30" />
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-2 border-primary-foreground/20" />
          <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full border-2 border-primary-foreground/30" />

          <div className="container relative z-10 mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-primary-foreground drop-shadow-sm md:text-4xl">
                Ready to Make a Difference?
              </h2>
              <p className="mb-8 text-lg text-primary-foreground/95">
                Join thousands of citizens contributing to government transparency and accountability
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg hover-lift border-2 border-primary-foreground"
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
                  className="border-2 border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground/10 shadow-lg hover-lift"
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageBackground>
  );
}
