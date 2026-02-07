import { useEffect, useState } from 'react';
import { Calendar, CheckCircle, Loader2, RefreshCcw, X, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { api } from '../../services/api';
import { toast } from 'sonner';

interface PriceVariation {
    actualPrice: number;
    discountedPrice: number;
    discountedPercentage: number;
}

interface SubscriptionPlan {
    plan_id: string;
    userid: string;
    name: string;
    product_id: string;
    price: Record<string, PriceVariation>;
    duration_days: number;
    features: string[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export function SubscriptionsView() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        product_id: '',
        duration_days: 30,
        features: '',
        price: '1000',
        discountedPrice: '800',
        discount: '20'
    });
    const [submitting, setSubmitting] = useState(false);

    interface Product {
        product_id: string;
        name: string;
    }

    const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch both plans and products
            const [plansData, productsData] = await Promise.all([
                api.subscriptions.getAll(),
                api.products.getAll()
            ]);

            setPlans(plansData);
            setAvailableProducts(productsData);

            // If we have products and creating a new plan, pre-select the first one
            if (productsData.length > 0 && !isEditMode && !formData.product_id) {
                setFormData(prev => ({ ...prev, product_id: productsData[0].product_id }));
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const resetForm = () => {
        setFormData({
            name: '',
            product_id: availableProducts[0]?.product_id || '',
            duration_days: 30,
            features: '',
            price: '1000',
            discountedPrice: '800',
            discount: '20'
        });
        setIsEditMode(false);
        setSelectedPlan(null);
    };

    const handlePriceChange = (field: 'price' | 'discountedPrice' | 'discount', value: string) => {
        const numValue = parseFloat(value) || 0;
        const currentActual = parseFloat(formData.price) || 0;
        const currentOffer = parseFloat(formData.discountedPrice) || 0;
        const currentDiscount = parseFloat(formData.discount) || 0;

        if (field === 'price') {
            const newOffer = Math.round(numValue * (1 - currentDiscount / 100));
            setFormData(prev => ({ ...prev, price: value, discountedPrice: newOffer.toString() }));
        } else if (field === 'discountedPrice') {
            const newDiscount = currentActual > 0 ? Math.round(((currentActual - numValue) / currentActual) * 100) : 0;
            setFormData(prev => ({ ...prev, discountedPrice: value, discount: newDiscount.toString() }));
        } else if (field === 'discount') {
            const newOffer = Math.round(currentActual * (1 - numValue / 100));
            setFormData(prev => ({ ...prev, discount: value, discountedPrice: newOffer.toString() }));
        }
    };

    const handleCreateOrUpdatePlan = async () => {
        try {
            setSubmitting(true);

            const plannedFeatures = formData.features.split(',').map(f => f.trim()).filter(f => f !== '');
            const actualPrice = parseFloat(formData.price) || 0;
            const discountedPrice = parseFloat(formData.discountedPrice) || 0;
            const discountPercentage = parseFloat(formData.discount) || 0;

            const payload = {
                userid: import.meta.env.VITE_DEFAULT_USER_ID,
                product_id: formData.product_id,
                name: formData.name,
                price: {
                    Standard: {
                        actualPrice: actualPrice,
                        discountedPrice: discountedPrice,
                        discountedPercentage: Math.round(discountPercentage)
                    }
                },
                duration_days: Number(formData.duration_days),
                features: plannedFeatures,
                is_active: true
            };


            if (isEditMode && selectedPlan) {
                await api.subscriptions.update(selectedPlan.plan_id, payload);
            } else {
                await api.subscriptions.create(payload);
            }

            await fetchPlans();
            setIsCreateModalOpen(false);
            resetForm();
            toast.success(`Plan ${isEditMode ? 'Updated' : 'Created'}`, {
                description: `The subscription plan has been ${isEditMode ? 'updated' : 'created'} successfully.`
            });
        } catch (err: any) {
            const errorMessage = err.detail
                ? (typeof err.detail === 'string' ? err.detail : JSON.stringify(err.detail))
                : (err.message || `Failed to ${isEditMode ? 'submit' : 'create'} plan`);
            toast.error('Operation Failed', {
                description: errorMessage
            });
        } finally {
            setSubmitting(false);
        }
    };

    const togglePlanStatus = (planId: string) => {
        setPlans(plans.map(p => p.plan_id === planId ? { ...p, is_active: !p.is_active } : p));
    };

    const deletePlan = (planId: string, userid: string) => {
        toast('Delete Plan?', {
            description: 'Are you sure you want to delete this subscription plan?',
            action: {
                label: 'Delete',
                onClick: async () => {
                    try {
                        await api.subscriptions.delete(planId, userid);
                        toast.success('Plan Deleted', {
                            description: 'The subscription plan has been removed successfully.'
                        });
                        await fetchPlans();
                    } catch (err: any) {
                        toast.error('Delete Failed', {
                            description: err.message || 'Failed to delete plan'
                        });
                    }
                }
            },
        });
    };

    const getStatusColor = (active: boolean) => {
        return active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="size-10 text-primary animate-spin" />
                <p className="text-muted-foreground animate-pulse font-medium">Loading subscription plans...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="p-6 bg-destructive/10 text-destructive rounded-2xl border border-destructive/20 max-w-md text-center shadow-sm">
                    <AlertCircle className="size-10 mx-auto mb-4 opacity-70" />
                    <p className="font-bold text-lg">Failed to Load</p>
                    <p className="text-sm mt-1 opacity-80">{error}</p>
                </div>
                <Button onClick={fetchPlans} variant="outline" className="flex items-center gap-2 rounded-xl">
                    <RefreshCcw className="size-4" />
                    Retry Fetching
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Subscription Plans</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Manage product tiers, pricing variations, and customer perks.</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setIsCreateModalOpen(true); }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 h-11 px-6 rounded-xl"
                >
                    <Plus className="size-5 mr-2" />
                    Create New Plan
                </Button>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map((plan, index) => {
                    const product = availableProducts.find(p => p.product_id === plan.product_id);
                    const productName = product ? product.name : plan.product_id;

                    return (
                        <Card
                            key={plan.plan_id}
                            className="group relative overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all duration-500 border-muted/50 hover:border-primary/50 rounded-2xl bg-card"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Status Ribbon */}
                            <div className={`h-1.5 w-full transition-colors duration-500 ${plan.is_active ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gray-300'}`} />

                            <div className="p-6 flex-1 flex flex-col">
                                {/* Card Header */}
                                <div className="flex justify-between items-start mb-5">
                                    <div className="flex items-center gap-4">
                                        <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl transition-all group-hover:bg-primary group-hover:text-primary-foreground shadow-sm">
                                            {plan.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl leading-none group-hover:text-primary transition-colors">{plan.name}</h3>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5 opacity-60">ID: {plan.plan_id}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        <Badge
                                            onClick={() => togglePlanStatus(plan.plan_id)}
                                            className={`${getStatusColor(plan.is_active)} hover:opacity-80 cursor-pointer border-0 shadow-sm px-3 py-1 text-[10px] rounded-full transition-all`}
                                        >
                                            {plan.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                        {Object.values(plan.price)[0]?.discountedPercentage > 0 && (
                                            <Badge className="bg-green-500/10 text-green-600 border-0 text-[10px] font-bold py-0.5 px-2 rounded-lg">
                                                {Object.values(plan.price)[0]?.discountedPercentage}% OFF
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 flex-1">
                                    {/* Compact IDs Grid */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="px-3 py-2 bg-secondary/10 rounded-xl border border-secondary/20 transition-colors group-hover:border-primary/20">
                                            <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-70">User Association</p>
                                            <p className="font-bold text-[11px] truncate mt-0.5">{plan.userid}</p>
                                        </div>
                                        <div className="px-3 py-2 bg-secondary/10 rounded-xl border border-secondary/20 transition-colors group-hover:border-primary/20">
                                            <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-70">Product / Days</p>
                                            <p className="font-bold text-[11px] truncate mt-0.5" title={productName}>{productName} / {plan.duration_days}d</p>
                                        </div>
                                    </div>

                                    {/* Pricing Section */}
                                    <div className="space-y-2">
                                        <div className="space-y-1.5">
                                            {Object.entries(plan.price).map(([key, value]) => (
                                                <div key={key} className="flex justify-between items-center px-3 py-2 rounded-xl bg-card border border-muted/60 transition-all hover:border-primary/30 hover:bg-primary/[0.02]">
                                                    <span className="font-semibold text-xs text-muted-foreground">{key}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-extrabold text-[14px] text-primary">₹{value.discountedPrice}</span>
                                                        <span className="text-[10px] text-muted-foreground line-through opacity-40">₹{value.actualPrice}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Highlights */}
                                    <div className="space-y-2">
                                        <ul className="space-y-1.5">
                                            {plan.features.slice(0, 2).map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-2.5 text-xs text-muted-foreground group/item">
                                                    <CheckCircle className="size-4 text-green-500/80 group-hover/item:text-green-500 transition-colors" />
                                                    <span className="truncate opacity-80 group-hover/item:opacity-100 transition-opacity">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Card Actions */}
                                <div className="flex gap-2.5 mt-6 pt-5 border-t border-muted/50">

                                    <div className="flex gap-1.5">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedPlan(plan);
                                                const priceObj = Object.values(plan.price)[0];
                                                setFormData({
                                                    name: plan.name,
                                                    product_id: plan.product_id,
                                                    duration_days: plan.duration_days,
                                                    features: plan.features.join(', '),
                                                    price: priceObj?.actualPrice.toString() || '0',
                                                    discountedPrice: priceObj?.discountedPrice.toString() || '0',
                                                    discount: priceObj?.discountedPercentage.toString() || '0'
                                                });
                                                setIsEditMode(true);
                                                setIsCreateModalOpen(true);
                                            }}
                                            className="size-10 rounded-xl hover:text-primary hover:border-primary/50 transition-all"
                                        >
                                            <Edit2 className="size-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => deletePlan(plan.plan_id, plan.userid)}
                                            className="size-10 rounded-xl hover:text-destructive hover:border-destructive/50 transition-all"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Visual Decoration */}
                            <div className="absolute -right-10 -bottom-10 size-40 bg-primary/3 rounded-full blur-[80px] group-hover:bg-primary/5 transition-colors duration-700 pointer-events-none" />
                        </Card>
                    );
                })}
            </div>

            {/* Empty State */}
            {plans.length === 0 && !loading && (
                <div className="text-center py-24 bg-card rounded-3xl border-2 border-dashed border-muted-foreground/20 max-w-2xl mx-auto shadow-sm">
                    <div className="size-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <RefreshCcw className="size-10 text-muted-foreground opacity-50" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">No Plans Available</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm mx-auto">Build your subscription tiers to start offering recurring value to your customers.</p>
                    <Button onClick={() => { resetForm(); setIsCreateModalOpen(true); }} className="mt-10 px-8 h-12 rounded-xl shadow-lg shadow-primary/20">Create First Plan</Button>
                </div>
            )}



            {/* Create/Edit Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in zoom-in-95 duration-300">
                    <Card className="max-w-md w-full rounded-3xl shadow-2xl overflow-hidden">
                        <div className="p-8 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold">{isEditMode ? 'Edit Plan' : 'New Subscription Plan'}</h3>
                                <Button variant="ghost" size="icon" onClick={() => { setIsCreateModalOpen(false); resetForm(); }} className="rounded-full">
                                    <X className="size-6" />
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Plan Display Name</label>
                                    <Input
                                        placeholder="e.g. Premium Monthly"
                                        className="h-12 rounded-xl"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Select Product</label>
                                        <select
                                            className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.product_id}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, product_id: e.target.value })}
                                        >
                                            <option value="" disabled>Choose a product</option>
                                            {availableProducts.map(product => (
                                                <option key={product.product_id} value={product.product_id}>
                                                    {product.name} ({product.product_id})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Duration (Days)</label>
                                        <Input
                                            type="number"
                                            placeholder="30"
                                            className="h-12 rounded-xl"
                                            value={formData.duration_days}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, duration_days: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Actual Price (₹)</label>
                                        <Input
                                            type="number"
                                            placeholder="1000"
                                            className="h-11 rounded-xl text-sm"
                                            value={formData.price}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePriceChange('price', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Discount (%)</label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                placeholder="20"
                                                className="h-11 rounded-xl text-sm pr-8"
                                                value={formData.discount}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePriceChange('discount', e.target.value)}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">%</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Offer Price (₹)</label>
                                        <Input
                                            type="number"
                                            placeholder="800"
                                            className="h-11 rounded-xl text-sm border-primary/20 bg-primary/[0.02]"
                                            value={formData.discountedPrice}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePriceChange('discountedPrice', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Features (Comma separated)</label>
                                    <Input
                                        placeholder="Free delivery, Priority support..."
                                        className="h-12 rounded-xl"
                                        value={formData.features}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, features: e.target.value })}
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <Button
                                        className="flex-1 h-12 rounded-xl font-bold"
                                        disabled={
                                            submitting ||
                                            !formData.name.trim() ||
                                            !formData.product_id ||
                                            !formData.features.trim() ||
                                            !formData.price ||
                                            parseFloat(formData.price) <= 0 ||
                                            !formData.discountedPrice ||
                                            Number(formData.duration_days) <= 0
                                        }
                                        onClick={handleCreateOrUpdatePlan}
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="size-4 mr-2 animate-spin" />
                                                {isEditMode ? 'Editing...' : 'Creating...'}
                                            </>
                                        ) : (
                                            isEditMode ? 'Edit Plan' : 'Create Plan'
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12 rounded-xl font-bold"
                                        onClick={() => { setIsCreateModalOpen(false); resetForm(); }}
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

