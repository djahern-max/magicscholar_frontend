// src/components/scholarships/SaveToTrackingButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

    const handleSaveScholarship = async () => {
        console.log("=== Save Scholarship Debug ===");
        console.log("Scholarship ID:", scholarshipId);
        console.log("Scholarship Title:", scholarshipTitle);

        setIsLoading(true);
        setError(null);

        try {
            // Get and validate token
            const token = localStorage.getItem("token");
            console.log("Token exists:", !!token);
            console.log("Token (first 20 chars):", token?.substring(0, 20));

            if (!token) {
                console.error("No token found - redirecting to login");
                router.push("/");
                return;
            }

            // Prepare request body
            const requestBody = {
                scholarship_id: scholarshipId,
                status: "interested",
                notes: null,
            };
            console.log("Request body:", JSON.stringify(requestBody, null, 2));

            // Prepare URL
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const fullUrl = `${apiUrl}/api/v1/scholarship-tracking/applications`;
            console.log("API URL:", apiUrl);
            console.log("Full URL:", fullUrl);

            // Make request
            console.log("Making POST request...");
            const response = await fetch(fullUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            console.log("Response status:", response.status);
            console.log("Response ok:", response.ok);

            // Try to get response body (even for errors)
            const responseText = await response.text();
            console.log("Response body (raw):", responseText);

            // Parse JSON if not empty
            let data;
            if (responseText) {
                try {
                    data = JSON.parse(responseText);
                    console.log("Response body (parsed):", data);
                } catch (e) {
                    console.error("Failed to parse response:", e);
                }
            }

            // Handle different status codes
            if (response.status === 201) {
                // Success!
                console.log("✅ Scholarship saved successfully:", data);
                setIsSaved(true);

                // Show success message briefly, then redirect
                setTimeout(() => {
                    router.push("/scholarships/dashboard");
                }, 1500);
            } else if (response.status === 400) {
                // Bad request - check for duplicate
                const errorMessage = data?.detail || "Bad request";
                console.error("❌ Bad request:", errorMessage);

                if (errorMessage.toLowerCase().includes("already") ||
                    errorMessage.toLowerCase().includes("duplicate") ||
                    errorMessage.toLowerCase().includes("saved")) {
                    setError("You've already saved this scholarship!");
                } else {
                    setError(errorMessage);
                }
            } else if (response.status === 401) {
                // Unauthorized - token expired or invalid
                console.error("❌ Unauthorized - token may be expired");
                setError("Your session has expired. Please log in again.");
                setTimeout(() => {
                    localStorage.removeItem("token");
                    router.push("/");
                }, 2000);
            } else if (response.status === 404) {
                // Not found - scholarship doesn't exist
                console.error("❌ Scholarship not found");
                setError("This scholarship no longer exists");
            } else if (response.status === 422) {
                // Validation error
                console.error("❌ Validation error:", data);
                setError("Invalid data. Please try again.");
            } else {
                // Other error
                console.error("❌ Unexpected error:", response.status, data);
                throw new Error(data?.detail || `Request failed with status ${response.status}`);
            }
        } catch (err) {
            console.error("❌ Catch block error:", err);

            if (err instanceof TypeError && err.message.includes("fetch")) {
                setError("Network error. Please check your connection and try again.");
            } else {
                setError(err instanceof Error ? err.message : "Failed to save scholarship");
            }
        } finally {
            setIsLoading(false);
            console.log("=== End Debug ===");
        }
    };

    if (isSaved) {
        return (
            <div className="flex items-center gap-2 px-6 py-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                    />
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
                className={`
          w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg
          font-medium transition-all duration-200
          ${isLoading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                    }
        `}
            >
                {isLoading ? (
                    <>
                        <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
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
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
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