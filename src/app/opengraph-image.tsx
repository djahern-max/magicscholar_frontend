// app/opengraph-image.tsx for MagicScholar App (app.magicscholar.com)
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default function OGImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                    color: '#ffffff',
                    fontFamily:
                        'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                }}
            >
                {/* Sparkle icon */}
                <div
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: '9999px',
                        border: '3px solid rgba(255, 255, 255, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 32,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <span style={{ fontSize: 48 }}>✨</span>
                </div>

                {/* Brand name */}
                <div
                    style={{
                        fontSize: 72,
                        fontWeight: 800,
                        marginBottom: 24,
                        letterSpacing: '-0.02em',
                    }}
                >
                    MagicScholar
                </div>

                {/* Tagline */}
                <div
                    style={{
                        fontSize: 32,
                        fontWeight: 500,
                        maxWidth: 800,
                        textAlign: 'center',
                        lineHeight: 1.4,
                        opacity: 0.95,
                    }}
                >
                    Track Applications. Find Scholarships. Get Organized.
                </div>

                {/* Supporting text */}
                <div
                    style={{
                        fontSize: 24,
                        marginTop: 32,
                        opacity: 0.8,
                        fontWeight: 400,
                    }}
                >
                    Free college planning tools for students & families
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}