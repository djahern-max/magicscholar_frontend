// src/components/scholarships/SaveToTrackingButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { triggerConfetti } from "@/lib/confettiHelper"; // ✅ use the helper that respects settings

interface SaveToTrackingButtonProps {
    scholarshipId: number;
    scholarshipTitle: string;
}

export default function SaveToTrackingButton({
    scholarshipId,
    scholarshipTitle,
}: SaveToTrackingButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // 🎉 quick celebration while we redirect
    const celebrateSave = () => {
        const duration = 1200; // ms
        const end = Date.now() + duration;

        const defaults = {
            origin: { y: 0.7 },
            scalar: 0.9,
            spread: 70,
            startVelocity: 40,
            zIndex: 9999,
            colors: ["#22c55e", "#60a5fa", "#a78bfa"], // green/blue/purple to match the app
        };

        (function frame() {
            triggerConfetti({ ...defaults, particleCount: 28 }); // Use helper instead of direct confetti
            if (Date.now() < end) requestAnimationFrame(frame);
        })();
    };

    const handleSaveScholarship = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                // Show error message first
                setError("Please log in to save scholarships to your dashboard");
                setIsLoading(false);

                // Redirect to login after showing message
                setTimeout(() => {
                    router.push("/");
                }, 2000);
                return;
            }

            const requestBody = {
                scholarship_id: scholarshipId,
                status: "interested",
                notes: null,
            };

            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const fullUrl = `${apiUrl}/api/v1/scholarship-tracking/applications`;

            const response = await fetch(fullUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            const responseText = await response.text();
            let data: any;
            if (responseText) {
                try {
                    data = JSON.parse(responseText);
                } catch {
                    /* ignore */
                }
            }

            if (response.status === 201) {
                // ✅ Success
                setIsSaved(true);
                celebrateSave(); // 🎉 fire now
                setTimeout(() => {
                    router.push("/scholarships/dashboard");
                }, 1200); // match confetti duration
                return;
            }

            if (response.status === 400) {
                const errorMessage = data?.detail || "Bad request";
                if (
                    errorMessage.toLowerCase().includes("already") ||
                    errorMessage.toLowerCase().includes("duplicate") ||
                    errorMessage.toLowerCase().includes("saved")
                ) {
                    setError("You've already saved this scholarship!");
                } else {
                    setError(errorMessage);
                }
                return;
            }

            if (response.status === 401) {
                setError("Your session has expired. Please log in again.");
                setTimeout(() => {
                    localStorage.removeItem("token");
                    router.push("/");
                }, 2000);
                return;
            }

            if (response.status === 404) {
                setError("This scholarship no longer exists");
                return;
            }

            if (response.status === 422) {
                setError("Invalid data. Please try again.");
                return;
            }

            throw new Error(data?.detail || `Request failed with status ${response.status}`);
        } catch (err) {
            if (err instanceof TypeError && err.message.includes("fetch")) {
                setError("Network error. Please check your connection and try again.");
            } else {
                setError(err instanceof Error ? err.message : "Failed to save scholarship");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isSaved) {
        return (
            <div className="flex items-center gap-2 px-6 py-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Saved! Redirecting to dashboard...</span>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <button
                onClick={handleSaveScholarship}
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg
          font-medium transition-all duration-200
          ${isLoading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                    }`}
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        Saving...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                        </svg>
                        Save to Dashboard
                    </>
                )}
            </button>

            {error && (
                <div className="px-4 py-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
                    {error}
                </div>
            )}
        </div>
    );
}