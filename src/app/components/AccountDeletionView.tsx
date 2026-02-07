import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { useState } from 'react';
import { api } from '@/services/api';
import { toast } from 'sonner';

export function AccountDeletionView() {
    const [mobileNumber, setMobileNumber] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const isValidMobile = /^\d{10}$/.test(mobileNumber);

    const handleDelete = async () => {
        if (!isValidMobile) return;

        setIsDeleting(true);
        try {
            await api.users.delete(mobileNumber);

            toast.success('Account Deleted', {
                description: `Successfully deleted account for +91 ${mobileNumber}`,
            });

            // Clear input on success
            setMobileNumber('');
        } catch (error: any) {
            console.error('Deletion error:', error);
            toast.error('Deletion Failed', {
                description: error.message || 'Could not find a user with this mobile number.',
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-full bg-[#f8fafc] p-8 space-y-8">
            {/* Brand Header */}
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold text-[#1a5d1a] tracking-tight">True Harvest</h1>
            </div>

            {/* Main Card */}
            <Card className="max-w-4xl mx-auto border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-2xl overflow-hidden pt-8">
                <CardContent className="px-10 pb-12 space-y-10">
                    {/* Header with Icon */}
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-red-50 rounded-2xl">
                            <Trash2 className="size-7 text-red-500" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-[#0f172a]">Account Deletion</h2>
                            <p className="text-slate-400 font-medium">Delete user accounts by mobile number</p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="space-y-6 max-w-lg">
                        <div className="space-y-3">
                            <Label htmlFor="mobile" className="text-slate-500 font-semibold text-sm">
                                User Mobile Number
                            </Label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-slate-200 pr-3 mr-3">
                                    <span className="text-slate-500 font-semibold text-base transition-colors group-focus-within:text-green-600">
                                        +91
                                    </span>
                                </div>
                                <Input
                                    id="mobile"
                                    type="text"
                                    placeholder="Enter 10-digit mobile number"
                                    className="pl-20 h-14 bg-white border-slate-200 rounded-xl text-base font-medium focus-visible:ring-green-100 focus-visible:border-green-500 transition-all duration-300"
                                    value={mobileNumber}
                                    disabled={isDeleting}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setMobileNumber(value);
                                    }}
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleDelete}
                            className={`w-full h-14 text-base font-bold rounded-xl shadow-lg transition-all ${isValidMobile && !isDeleting
                                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-100 cursor-pointer'
                                : 'bg-[#cbd5e1] text-white shadow-slate-200 cursor-not-allowed grayscale'
                                }`}
                            disabled={!isValidMobile || isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="size-5 animate-spin mr-2" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete Account'
                            )}
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
