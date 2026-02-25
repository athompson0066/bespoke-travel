
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Hr,
} from "npm:@react-email/components@0.0.12";
import * as React from "npm:react@18.2.0";

interface Place {
    placeName: string;
    description: string;
    customImageUrl?: string;
    imageKeyword?: string;
    groundingUrl?: string;
    video?: {
        url: string;
        title?: string;
    };
    mediaOptions?: {
        videoTour?: {
            url: string;
            title?: string;
        } | null;
    };
}

interface DayPlan {
    day: number;
    title: string;
    morning?: Place;
    afternoon?: Place;
    evening?: Place;
    accommodation?: Place;
    vibeDeck?: string;
}

interface ItineraryEmailProps {
    clientName: string;
    agentName?: string;
    agentBusiness?: string;
    destination: string;
    itinerary: DayPlan[];
    tips?: {
        currency: string;
        tipping: string;
        dressCode: string;
        etiquette: string;
    };
}

export const ItineraryEmail = ({
    clientName = "Valued Client",
    agentName = "Bespoke AI",
    agentBusiness = "Bespoke AI",
    destination = "Paris, France",
    itinerary = [],
    tips,
}: ItineraryEmailProps) => {
    const previewText = `Your luxury itinerary for ${destination} is ready.`;
    const mainVibe = itinerary[0]?.vibeDeck || "Luxury Travel";
    const playlistUrl = `https://open.spotify.com/search/${encodeURIComponent(mainVibe)}`;
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Trip+to+${encodeURIComponent(destination)}&details=Luxury+Itinerary+by+Bespoke+AI`;

    const styles = {
        body: {
            backgroundColor: "#f4f4f5",
            fontFamily: '"Lato", sans-serif',
            color: "#1a1a1a",
            margin: "0 auto",
            padding: "32px 8px",
        },
        container: {
            backgroundColor: "transparent",
            margin: "0 auto",
            maxWidth: "600px",
        },
        brandingHeader: {
            textAlign: "center" as const,
            marginBottom: "32px",
        },
        brandName: {
            fontSize: "36px",
            fontFamily: '"Playfair Display", serif',
            fontWeight: "bold",
            color: "#000000",
            margin: "0",
            padding: "0",
            letterSpacing: "-0.025em",
        },
        tagline: {
            color: "#6b7280",
            fontSize: "12px",
            marginTop: "8px",
            textTransform: "uppercase" as const,
            letterSpacing: "0.2em",
        },
        introCard: {
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "32px",
            marginBottom: "32px",
            textAlign: "center" as const,
            border: "1px solid #f3f4f6",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        },
        destinationTitle: {
            fontSize: "30px",
            fontFamily: '"Playfair Display", serif',
            color: "#000000",
            marginBottom: "16px",
            marginTop: "0",
        },
        introText: {
            fontSize: "18px",
            color: "#4b5563",
            lineHeight: "1.6",
            marginBottom: "24px",
        },
        divider: {
            borderColor: "#e5e7eb",
            width: "64px",
            margin: "0 auto",
        },
        dayHeader: {
            marginBottom: "24px",
            marginTop: "32px",
            textAlign: "center" as const,
        },
        dayBadge: {
            display: "inline-block",
            backgroundColor: "#1a1a1a",
            color: "#ffffff",
            padding: "4px 16px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: "bold",
            textTransform: "uppercase" as const,
            letterSpacing: "0.1em",
        },
        dayTitle: {
            fontSize: "24px",
            fontFamily: '"Playfair Display", serif',
            marginTop: "12px",
            marginBottom: "0",
            color: "#000000",
        },
        placeCard: {
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            border: "1px solid #f3f4f6",
            marginBottom: "24px",
        },
        heroImageContainer: {
            height: "240px",
            width: "100%",
            backgroundColor: "#e5e7eb",
        },
        heroImage: {
            width: "100%",
            height: "100%",
            objectFit: "cover" as const,
        },
        cardContent: {
            padding: "24px",
        },
        timeSlot: {
            textTransform: "uppercase" as const,
            fontSize: "12px",
            fontWeight: "bold",
            color: "#b45309",
            marginBottom: "8px",
            letterSpacing: "0.1em",
        },
        placeName: {
            fontSize: "20px",
            fontWeight: "bold",
            color: "#1a1a1a",
            marginTop: "0",
            marginBottom: "8px",
        },
        description: {
            fontSize: "16px",
            color: "#4b5563",
            lineHeight: "1.6",
            marginBottom: "16px",
        },
        button: {
            color: "#ffffff",
            backgroundColor: "#000000",
            padding: "10px 20px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "bold",
            textTransform: "uppercase" as const,
            letterSpacing: "0.05em",
            textDecoration: "none",
            display: "inline-block",
        },
        accommodationCard: {
            backgroundColor: "#1a1a1a",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            marginBottom: "48px",
            color: "#ffffff",
        },
        accImageContainer: {
            position: "relative" as const,
            height: "240px",
            width: "100%",
        },
        accImage: {
            width: "100%",
            height: "100%",
            objectFit: "cover" as const,
            opacity: "0.8",
        },
        gradientOverlay: {
            position: "absolute" as const,
            bottom: "0",
            left: "0",
            right: "0",
            height: "50%",
            background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
        },
        accTextOverlay: {
            position: "absolute" as const,
            bottom: "24px",
            left: "24px",
            right: "24px",
        },
        accSubtitle: {
            textTransform: "uppercase" as const,
            fontSize: "12px",
            fontWeight: "bold",
            color: "#D4AF37",
            marginBottom: "4px",
            letterSpacing: "0.1em",
        },
        accTitle: {
            fontSize: "24px",
            fontFamily: '"Playfair Display", serif',
            color: "#ffffff",
            margin: "0",
        },
        accContent: {
            padding: "24px",
        },
        accDescription: {
            color: "#d1d5db",
            lineHeight: "1.6",
            margin: "0 0 16px 0",
        },
        accButton: {
            color: "#000000",
            backgroundColor: "#ffffff",
            padding: "10px 20px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "bold",
            textTransform: "uppercase" as const,
            letterSpacing: "0.05em",
            textDecoration: "none",
            display: "inline-block",
        },
        footer: {
            textAlign: "center" as const,
            marginTop: "32px",
            paddingBottom: "32px",
        },
        footerIcon: {
            margin: "0 auto 16px auto",
            opacity: "0.5",
            filter: "grayscale(100%)",
        },
        footerText: {
            fontSize: "12px",
            color: "#9ca3af",
            margin: "0 0 8px 0",
        },
    };

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={styles.body}>
                <Container style={styles.container}>

                    {/* Branding Header */}
                    <Section style={styles.brandingHeader}>
                        <Heading style={styles.brandName}>
                            {agentBusiness}
                        </Heading>
                        <Text style={styles.tagline}>
                            The Art of Travel
                        </Text>
                    </Section>

                    {/* Intro Card */}
                    <Section style={styles.introCard}>
                        <Heading as="h2" style={styles.destinationTitle}>
                            {destination}
                        </Heading>
                        <Text style={styles.introText}>
                            Dear {clientName},<br />
                            Your bespoke journey has been crafted. Every moment is designed for wonder.
                        </Text>
                        <Hr style={styles.divider} />
                    </Section>

                    {/* Daily Itinerary */}
                    {itinerary && itinerary.length > 0 ? (
                        itinerary.map((day, index) => (
                            <React.Fragment key={day.day || index}>
                                {/* Day Divider */}
                                <Section style={styles.dayHeader}>
                                    <div style={styles.dayBadge}>
                                        Day {day.day}
                                    </div>
                                    <Heading as="h3" style={styles.dayTitle}>
                                        {day.title}
                                    </Heading>
                                </Section>

                                {/* Activities */}
                                {["morning", "afternoon", "evening"].map((timeSlot) => {
                                    const place = day[timeSlot as keyof DayPlan] as Place | undefined;
                                    if (!place) return null;

                                    const imgUrl =
                                        place.customImageUrl ||
                                        `https://loremflickr.com/600/400/${encodeURIComponent(
                                            place.imageKeyword || place.placeName
                                        )},luxury`;

                                    return (
                                        <Section key={timeSlot} style={styles.placeCard}>
                                            {/* Hero Image */}
                                            <div style={styles.heroImageContainer}>
                                                <Img
                                                    src={imgUrl}
                                                    alt={place.placeName}
                                                    style={styles.heroImage}
                                                    width="600"
                                                    height="240"
                                                />
                                            </div>

                                            {/* Card Content */}
                                            <div style={styles.cardContent}>
                                                <Text style={styles.timeSlot}>
                                                    {timeSlot}
                                                </Text>
                                                <Heading as="h4" style={styles.placeName}>
                                                    {place.placeName}
                                                </Heading>
                                                <Text style={styles.description}>
                                                    {place.description}
                                                </Text>

                                                {place.groundingUrl && (
                                                    <Link
                                                        href={place.groundingUrl}
                                                        style={styles.button}
                                                    >
                                                        View Location
                                                    </Link>
                                                )}
                                                {(place.video?.url || place.mediaOptions?.videoTour?.url) && (
                                                    <Link
                                                        href={place.video?.url || place.mediaOptions?.videoTour?.url}
                                                        style={{ ...styles.button, marginLeft: "8px", backgroundColor: "#D4AF37", color: "#000000" }}
                                                    >
                                                        ▶ Watch Tour
                                                    </Link>
                                                )}
                                            </div>
                                        </Section>
                                    );
                                })}

                                {/* Accommodation Highlight */}
                                {day.accommodation && (
                                    <Section style={styles.accommodationCard}>
                                        <div style={styles.accImageContainer}>
                                            <Img
                                                src={
                                                    day.accommodation.customImageUrl ||
                                                    `https://loremflickr.com/600/400/${encodeURIComponent(
                                                        day.accommodation.imageKeyword || "hotel"
                                                    )},resort`
                                                }
                                                alt={day.accommodation.placeName}
                                                style={styles.accImage}
                                                width="600"
                                                height="240"
                                            />
                                            <div style={styles.gradientOverlay}></div>
                                            <div style={styles.accTextOverlay}>
                                                <Text style={styles.accSubtitle}>
                                                    Rest & Rejuvenate
                                                </Text>
                                                <Heading as="h4" style={styles.accTitle}>
                                                    {day.accommodation.placeName}
                                                </Heading>
                                            </div>
                                        </div>
                                        <div style={styles.accContent}>
                                            <Text style={styles.accDescription}>
                                                {day.accommodation.description}
                                            </Text>
                                            {day.accommodation.groundingUrl && (
                                                <Link
                                                    href={day.accommodation.groundingUrl}
                                                    style={styles.accButton}
                                                >
                                                    View Hotel
                                                </Link>
                                            )}
                                            {(day.accommodation.video?.url || day.accommodation.mediaOptions?.videoTour?.url) && (
                                                <Link
                                                    href={day.accommodation.video?.url || day.accommodation.mediaOptions?.videoTour?.url}
                                                    style={{ ...styles.accButton, marginLeft: "8px", backgroundColor: "#D4AF37", color: "#000000" }}
                                                >
                                                    ▶ Watch Tour
                                                </Link>
                                            )}
                                        </div>
                                    </Section>
                                )}
                            </React.Fragment>
                        ))
                    ) : null}

                    {/* Practical Utilities */}
                    <Section style={styles.introCard}>
                        <Heading as="h3" style={{ ...styles.destinationTitle, fontSize: '24px' }}>
                            Elevate Your Journey
                        </Heading>
                        <Section>
                            <div style={{ textAlign: 'center', padding: '10px' }}>
                                <Link href={playlistUrl} style={styles.button}>
                                    ♫ The Sound of {destination}
                                </Link>
                            </div>
                            <div style={{ textAlign: 'center', padding: '10px' }}>
                                <Link href={calendarUrl} style={{ ...styles.button, backgroundColor: '#ffffff', color: '#000000', border: '1px solid #000000' }}>
                                    📅 Add to Calendar
                                </Link>
                            </div>
                        </Section>
                    </Section>

                    {/* Know Before You Go */}
                    {tips && (
                        <Section style={styles.accommodationCard}>
                            <div style={{ padding: '32px', textAlign: 'center' }}>
                                <Heading as="h3" style={styles.accTitle}>
                                    Know Before You Go
                                </Heading>
                                <Hr style={{ ...styles.divider, borderColor: '#4b5563', margin: '24px auto' }} />

                                <Section style={{ marginBottom: '24px' }}>
                                    <div style={{ display: 'inline-block', width: '48%', verticalAlign: 'top', paddingRight: '2%' }}>
                                        <Text style={styles.accSubtitle}>Currency</Text>
                                        <Text style={styles.accDescription}>{tips.currency}</Text>
                                    </div>
                                    <div style={{ display: 'inline-block', width: '48%', verticalAlign: 'top', paddingLeft: '2%' }}>
                                        <Text style={styles.accSubtitle}>Tipping</Text>
                                        <Text style={styles.accDescription}>{tips.tipping}</Text>
                                    </div>
                                </Section>
                                <Section>
                                    <div style={{ display: 'inline-block', width: '48%', verticalAlign: 'top', paddingRight: '2%' }}>
                                        <Text style={styles.accSubtitle}>Dress Code</Text>
                                        <Text style={styles.accDescription}>{tips.dressCode}</Text>
                                    </div>
                                    <div style={{ display: 'inline-block', width: '48%', verticalAlign: 'top', paddingLeft: '2%' }}>
                                        <Text style={styles.accSubtitle}>Etiquette</Text>
                                        <Text style={styles.accDescription}>{tips.etiquette}</Text>
                                    </div>
                                </Section>
                            </div>
                        </Section>
                    )}
                    {/* End of Content Check */}
                    {itinerary.length === 0 && (
                        <Section style={styles.introCard}>
                            <Text style={{ ...styles.introText, fontStyle: 'italic' }}>
                                Your itinerary is being confirmed.
                            </Text>
                        </Section>
                    )}

                    {/* Footer */}
                    <Section style={styles.footer}>
                        <Img
                            src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png"
                            width="32"
                            height="32"
                            alt={agentBusiness}
                            style={styles.footerIcon}
                        />
                        <Text style={styles.footerText}>
                            Curated primarily for {clientName} by {agentName}
                        </Text>
                        <Text style={styles.footerText}>
                            © {new Date().getFullYear()} {agentBusiness} • Luxury Travel Automation
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default ItineraryEmail;
