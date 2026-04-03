import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Clock, RefreshCw } from 'lucide-react';

export default function ClaimPipeline({ events = [], fraudScore = 12, isProcessed = false }) {
    const steps = [
        { id: 1, label: 'Sensor Breach', detail: `Threshold crossed for ${events.join(', ')}` },
        { id: 2, label: 'Multi-Source Verify', detail: 'Confirmed with 2nd API' },
        { id: 3, label: 'Cluster Check', detail: 'Zone density validated' },
        { id: 4, label: 'Fraud Score', detail: `Score: ${fraudScore} (Clean)` },
        { id: 5, label: 'Payout Calc', detail: 'Amount generated' },
        { id: 6, label: 'UPI Transfer', detail: 'Gateway initiated' },
        { id: 7, label: 'Credited', detail: 'Worker account funded' }
    ];

    const [step, setStep] = useState(isProcessed ? steps.length : 0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // If we were already animating, don't just jump to the end 
        // to avoid visual "flicker" when data re-refetch is fast.
        if (isProcessed && !isAnimating) {
            setStep(steps.length);
            return;
        }

        if (events.length === 0) return;

        // If we haven't reached the end, let's keep going!
        if (step < steps.length) {
            setIsAnimating(true);
            const interval = setInterval(() => {
                setStep(prev => {
                    if (prev >= steps.length) {
                        clearInterval(interval);
                        setIsAnimating(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 800);
            return () => clearInterval(interval);
        }
    }, [events.length, isProcessed]);

    return (
        <div className="bg-white border border-gs-border rounded-lg p-5">
            <div className="flex flex-wrap gap-2 md:gap-4 justify-between relative">
                {/* Connecting line background */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100 z-0 hidden md:block" />
                
                {steps.map((s, index) => {
                    const isCompleted = step > index;
                    const isCurrent = step === index;
                    const isPending = step < index;

                    return (
                        <div key={s.id} className="flex flex-col items-center z-10 w-full md:w-auto mb-4 md:mb-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 border-2 transition-colors duration-300 ${
                                isCompleted ? 'bg-green-100 border-green-500 text-green-600' :
                                isCurrent ? 'bg-blue-50 border-blue-500 text-blue-600' :
                                'bg-white border-gray-200 text-gray-400'
                            }`}>
                                {isCompleted ? <CheckCircle size={16} /> : 
                                 isCurrent ? <RefreshCw size={14} className="animate-spin" /> : 
                                 <Clock size={14} />}
                            </div>
                            <p className={`text-xs font-medium text-center ${
                                isCompleted ? 'text-gs-navy' :
                                isCurrent ? 'text-blue-600 font-bold' :
                                'text-gray-400'
                            }`}>
                                {s.label}
                            </p>
                            <p className="text-[10px] text-gray-400 text-center mt-1 hidden md:block max-w-[80px]">
                                {isCompleted || isCurrent ? s.detail : 'Waiting...'}
                            </p>
                        </div>
                    );
                })}
            </div>
            
            {step >= steps.length && (
                <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-100 flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={16} />
                    <span className="text-sm text-green-800 font-medium">Claim successfully processed and payout dispatched. No paperwork required.</span>
                </div>
            )}
            
            {step < steps.length && step > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100 flex items-center gap-2">
                    <RefreshCw className="text-blue-600 animate-spin" size={16} />
                    <span className="text-sm text-blue-800">Processing verification step: {steps[step]?.label}</span>
                </div>
            )}
        </div>
    );
}
