import React, { useState } from 'react';
import { User, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../app/components/ui/alert-dialog";

const DeactivateUser: React.FC = () => {
    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            setLoading(true);
            await api.users.delete(mobile);
            toast.success('User deleted successfully');
            setMobile('');
        } catch (error: any) {
            console.error('Error deleting user:', error);
            toast.error(error.message || 'Failed to delete user.');
        } finally {
            setLoading(false);
            setConfirmOpen(false);
        }
    };

    return (
        <div className="flex justify-center w-full">
            <div className="relative flex flex-col items-center justify-center bg-white rounded-lg w-[fit-content] text-gray-900 py-10 px-10 font-sans animate-[fadeIn_0.5s_ease-out] shadow-2xl">

                <div className="w-full max-w-md flex flex-col items-center">
                    {/* Header Section */}
                    <div className="w-full mb-8 relative">
                        <h1 className="text-4xl font-bold tracking-tight mb-2">
                            Delete User
                        </h1>
                        <p className="mt-4 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                            <span className="font-bold">Note:</span> This action is permanent and cannot be undone.
                        </p>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="w-full space-y-6">

                        {/* Input Field with Custom Icon Styling */}
                        <div className="group relative">
                            <div className="flex items-center space-x-4 mb-2">
                                <div className="bg-white rounded-full p-1 border border-gray-200 shadow-sm">
                                    <User className="w-5 h-5 text-black" fill="currentColor" />
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-500" />
                                <div className="flex-1">
                                    <input
                                        type="tel"
                                        placeholder="Enter mobile number"
                                        className="w-full bg-transparent border-none text-gray-900 text-lg placeholder-gray-400 focus:ring-0 focus:outline-none"
                                        required
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="h-[1px] w-full bg-gray-200 mt-2"></div>

                        {/* Delete Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 bg-[#2a9d8f] hover:bg-[#21867a] text-white font-bold text-lg rounded-2xl shadow-lg shadow-[#2a9d8f]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 mt-8 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'DELETING...' : 'DELETE USER'}
                        </button>
                    </form>

                    <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the user with mobile number <span className="font-bold text-gray-900">{mobile}</span> and remove their data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleConfirmDelete();
                                    }}
                                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                    disabled={loading}
                                >
                                    {loading ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </div>
            </div>
        </div>
    );
};

export default DeactivateUser;

