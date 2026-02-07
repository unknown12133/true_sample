import React from 'react';
import { Shield, Lock, FileText, Eye, Database, Globe, Scale, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="w-full max-w-5xl mx-auto py-8 px-4 space-y-8 animate-[fadeIn_0.5s_ease-out]">

            {/* Header */}
            <div className="text-center space-y-4 mb-8">
                <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-2">
                    <Shield className="size-10 text-primary" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">Privacy & Policy</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                    Simplifying how we handle your data at <span className="text-foreground font-semibold">True Harvest</span>.
                    Transparency is our core value.
                </p>
                <div className="flex justify-center gap-2 mt-4">
                    {/* <Badge variant="outline" className="text-xs px-3 py-1">Last Updated: October 2023</Badge> */}
                    {/* <Badge variant="outline" className="text-xs px-3 py-1">Version 1.2</Badge> */}
                </div>
            </div>

            {/* Quick Links / Summary Grid is implied by the layout of cards */}
            <div className="grid md:grid-cols-2 gap-6">

                {/* 1. Information Collection */}
                <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Database className="size-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-lg">Information We Collect</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm space-y-3 pt-4">
                        <p>We collect information to provide better services to all our users. This includes:</p>
                        <ul className="list-disc list-inside space-y-1 ml-1 text-foreground/80">
                            <li><strong>Personal Information:</strong> Name, Email address, Phone number, and Billing/Shipping address.</li>
                            <li><strong>Usage Data:</strong> Information on how you interact with our services, including access times and pages viewed.</li>
                            <li><strong>Device Information:</strong> Hardware model, operating system version, and unique device identifiers.</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* 2. Usage of Information */}
                <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <Eye className="size-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-lg">How We Use Your Data</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm space-y-3 pt-4">
                        <p>Your data powers the core functionality of True Harvest:</p>
                        <ul className="list-disc list-inside space-y-1 ml-1 text-foreground/80">
                            <li>Processing orders and managing your account.</li>
                            <li>Sending administrative information, such as order confirmations and updates.</li>
                            <li>Improving our platform through analytics and user feedback.</li>
                            <li>Fraud prevention and ensuring the security of our services.</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* 3. Data Protection */}
                <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Lock className="size-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-lg">Data Security</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm space-y-3 pt-4">
                        <p>
                            We employ industry-standard security measures designed to protect your data from unauthorized access, disclosure, alteration, and destruction.
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-1 text-foreground/80">
                            <li>Encryption of sensitive data in transit and at rest.</li>
                            <li>Regular security audits and vulnerability assessments.</li>
                            <li>Strict access controls for our internal teams.</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* 4. Third-Party Sharing */}
                <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                            <Globe className="size-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-lg">Information Sharing</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm space-y-3 pt-4">
                        <p>We do not sell your personal data. We only share information with:</p>
                        <ul className="list-disc list-inside space-y-1 ml-1 text-foreground/80">
                            <li>Service providers (e.g., payment processors, shipping partners) under strict confidentiality agreements.</li>
                            <li>Legal authorities when required by law or to protect our rights.</li>
                        </ul>
                    </CardContent>
                </Card>

            </div>

            <Separator className="my-8" />

            {/* Terms of Service Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-500/10 rounded-lg">
                        <FileText className="size-6 text-slate-600" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Terms of Service</h2>
                </div>

                <div className="prose prose-slate max-w-none text-muted-foreground">
                    <p className="leading-relaxed">
                        By accessing or using the True Harvest platform, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 mt-6">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                                <Scale className="size-4" /> Account Responsibilities
                            </h3>
                            <p className="text-sm">
                                You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                                <Scale className="size-4" /> Intellectual Property
                            </h3>
                            <p className="text-sm">
                                The Service and its original content, features, and functionality are and will remain the exclusive property of True Harvest and its licensors.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                                <Scale className="size-4" /> Termination
                            </h3>
                            <p className="text-sm">
                                We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                                <Scale className="size-4" /> Governing Law
                            </h3>
                            <p className="text-sm">
                                These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 bg-muted/50 rounded-xl p-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-background rounded-full mb-2 shadow-sm">
                    <HelpCircle className="size-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Have questions about our policy?</h3>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@trueharvest.com" className="text-primary hover:underline font-medium">support@trueharvest.com</a>
                </p>
            </div>

            <div className="text-center text-xs text-muted-foreground pt-8 pb-4">
                &copy; {new Date().getFullYear()} True Harvest. All rights reserved.
            </div>

        </div>
    );
};

export default PrivacyPolicy;
