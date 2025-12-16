"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { submitContactForm } from "@/actions/contact.actions";
import { contactSchema, type ContactFormData } from "@/lib/validations/contact";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageBackground } from "@/components/ui/page-background";

export default function ConnectPage() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    const contactMutation = useMutation({
        mutationFn: submitContactForm,
        onSuccess: (data) => {
            if (data.error) {
                setError(data.error);
            } else {
                setSuccess(true);
                form.reset();
                setTimeout(() => setSuccess(false), 5000);
            }
        },
    });

    const onSubmit = (data: ContactFormData) => {
        setError(null);
        contactMutation.mutate(data);
    };

    return (
        <PageBackground>
            <div className="container mx-auto px-4 py-24">
                <div className="mx-auto max-w-5xl">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
                            Connect With Us
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Have questions, feedback, or new information? We&apos;d love to hear
                            from you.
                        </p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Contact Form */}
                        <Card className="lg:col-span-2 glass glass-border">
                            <CardHeader>
                                <CardTitle className="text-card-foreground">Send us a message</CardTitle>
                                <CardDescription>
                                    Fill out the form below and we&apos;ll get back to you as soon as
                                    possible.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {error && (
                                    <div className="mb-4 flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {success && (
                                    <div className="mb-4 flex items-center gap-2 rounded-md bg-green-500/10 border border-green-500/30 p-3 text-sm text-green-600">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span>Message sent successfully! We&apos;ll be in touch soon.</span>
                                    </div>
                                )}

                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Your full name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            placeholder="you@example.com"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="subject"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Subject (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Message subject" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Message</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Tell us what you think or share new information..."
                                                            className="min-h-[120px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button
                                            type="submit"
                                            className="w-full shadow-lg hover-lift"
                                            disabled={contactMutation.isPending || success}
                                        >
                                            {contactMutation.isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                "Send Message"
                                            )}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <div className="space-y-6">
                            <Card className="glass glass-border hover-lift">
                                <CardHeader>
                                    <CardTitle className="text-lg text-card-foreground">Email</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                            <Mail className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">General Inquiries</p>
                                            <a
                                                href="mailto:contact@taxlens.com"
                                                className="text-sm text-muted-foreground hover:text-primary"
                                            >
                                                contact@taxlens.com
                                            </a>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass glass-border hover-lift">
                                <CardHeader>
                                    <CardTitle className="text-lg text-card-foreground">Phone</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                            <Phone className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">Support Line</p>
                                            <a
                                                href="tel:+923001234567"
                                                className="text-sm text-muted-foreground hover:text-primary"
                                            >
                                                +92 300 1234567
                                            </a>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass glass-border hover-lift">
                                <CardHeader>
                                    <CardTitle className="text-lg text-card-foreground">Location</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                            <MapPin className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">Office</p>
                                            <p className="text-sm text-muted-foreground">
                                                Islamabad, Pakistan
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </PageBackground>
    );
}
