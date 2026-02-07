import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';
import { Lock, Phone, Loader2 } from 'lucide-react';

interface LoginViewProps {
    onLogin: () => void;
}

export function LoginView({ onLogin }: LoginViewProps) {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Static credentials check
        setTimeout(() => {
            if (mobile === '7671939730' && password === '123456') {
                localStorage.setItem('isAuthenticated', 'true');
                onLogin();
                toast.success('Login Successful', {
                    description: 'Welcome back to True Harvest Admin Panel',
                });
            } else {
                toast.error('Invalid Credentials', {
                    description: 'Please check your mobile number and password.',
                });
            }
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Brand Header */}
                <div className="text-center space-y-2">
                    <div className="flex justify-center mb-6">
                        <div className="size-16 bg-[#1a5d1a] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
                            <span className="font-black text-3xl italic text-white">T</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#1a5d1a] tracking-tight">True Harvest</h1>
                    <p className="text-slate-500 font-medium tracking-tight">Admin Dashboard Login</p>
                </div>

                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-2xl overflow-hidden p-2">
                    <CardContent className="p-8 space-y-6">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="mobile" className="text-slate-500 font-semibold text-sm">
                                        Mobile Number
                                    </Label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-slate-400 group-focus-within:text-[#1a5d1a] transition-colors">
                                            <Phone className="size-5" />
                                        </div>
                                        <Input
                                            id="mobile"
                                            type="text"
                                            placeholder="Enter mobile number"
                                            className="pl-12 h-14 bg-white border-slate-200 rounded-xl text-base font-medium focus-visible:ring-green-100 focus-visible:border-green-500 transition-all duration-300"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-slate-500 font-semibold text-sm">
                                        Password
                                    </Label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-slate-400 group-focus-within:text-[#1a5d1a] transition-colors">
                                            <Lock className="size-5" />
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter password"
                                            className="pl-12 h-14 bg-white border-slate-200 rounded-xl text-base font-medium focus-visible:ring-green-100 focus-visible:border-green-500 transition-all duration-300"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 text-base font-bold bg-[#1a5d1a] hover:bg-[#154a15] text-white rounded-xl shadow-lg shadow-green-100 transition-all"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="size-5 animate-spin mr-2" />
                                        Checking credentials...
                                    </>
                                ) : (
                                    'Login to Dashboard'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-slate-400 text-sm font-medium">
                    © {new Date().getFullYear()} True Harvest. All rights reserved.
                </p>
            </div>
        </div>
    );
}
