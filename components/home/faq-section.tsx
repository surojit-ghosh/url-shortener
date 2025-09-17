import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "How does Snippy work?",
        answer: "Snippy takes your long URLs and creates short, branded links that redirect to your original destination. Simply paste your URL, customize your short link, and share it anywhere. We track every click and provide detailed analytics.",
    },
    {
        question: "Is Snippy free to use?",
        answer: "Yes! Snippy offers a generous free plan that includes up to 50 links, basic analytics, and QR code generation. For more advanced features like unlimited links, custom domains, and advanced analytics, we offer affordable premium plans.",
    },
    {
        question: "Can I customize my short links?",
        answer: "Absolutely! You can create custom short links with your own branded keywords. For example, instead of a random string, you can create Snippy.sh/summer-sale. Premium users can also use their own custom domains.",
    },
    {
        question: "How detailed are the analytics?",
        answer: "Our analytics provide comprehensive insights including click counts, geographic data, device types, referrer sources, and time-based trends. Premium plans include even more detailed analytics with custom reporting options.",
    },
    {
        question: "Can I password protect my links?",
        answer: "Yes! You can add password protection to any link, set expiration dates, and even implement geographic targeting. This ensures your content is only accessible to the right audience at the right time.",
    },
    {
        question: "Are there any limits on link creation?",
        answer: "Free accounts can create up to 50 links. Premium plans offer unlimited link creation. There are no limits on the number of clicks your links can receive on any plan.",
    },
    {
        question: "Can I integrate Snippy with my applications?",
        answer: "Yes! We provide a comprehensive REST API that allows you to integrate link shortening functionality directly into your applications. API access is available for premium users with detailed documentation and examples.",
    },
    {
        question: "What happens if I delete a link?",
        answer: "Once a link is deleted, it will no longer redirect to the destination URL and will show a 404 error instead. This action cannot be undone, so please be careful when deleting links.",
    },
];

export function FaqSection() {
    return (
        <section id="faq" className="py-20">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground mt-6 text-lg leading-8">
                        Everything you need to know about Snippy. Can&apos;t find what you&apos;re
                        looking for? Feel free to reach out to our support team.
                    </p>
                </div>

                <div className="m-16 mx-auto max-w-4xl">
                    <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="rounded-lg border px-6"
                            >
                                <AccordionTrigger className="py-6 text-left hover:no-underline">
                                    <span className="font-medium">{faq.question}</span>
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground pb-6">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
