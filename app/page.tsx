import {
    Navbar,
    HeroSection,
    FeaturesSection,
    StatsSection,
    FaqSection,
    Footer,
} from "@/components/home";

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                <HeroSection />
                <FeaturesSection />
                <StatsSection />
                <FaqSection />
            </main>
            <Footer />
        </div>
    );
}
