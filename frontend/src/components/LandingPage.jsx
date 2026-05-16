import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, User, Stethoscope, Mail, Phone, MapPin, Zap, Award, Star, ChevronLeft, ChevronRight, LogIn, ArrowRight, Ambulance, Shield, BriefcaseMedical } from 'lucide-react'; 

// ==========================================
// 0. GLOBAL CONSTANTS & STYLES (ABSOLUTE TOP LEVEL)
// ==========================================

const PrimaryBlue = '#0069D9';
const SecondaryGreen = '#20C997'; 
const DarkText = '#1f2937';
const LightText = '#6b7280';
const LightBg = '#ffffff'; 
const AccentBg = '#f5f7fa'; 
const DarkBg = '#1e293b';

// Array of light pastel colors for the carousel cards
const PastelColors = ['#f0f9ff', '#e8f5e9', '#fff0f5', '#f0f4ff']; 

const GlobalStyles = {
    container: {
        fontFamily: 'Inter, "Segoe UI", sans-serif',
        lineHeight: 1.6,
        color: DarkText,
        background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)', 
        overflowX: 'hidden',
        minHeight: '100vh', 
        width: '100vw',
    },
    section: {
        padding: '80px 40px', 
        maxWidth: '1200px',
        margin: '0 auto',
        boxSizing: 'border-box',
    },
    title: {
        fontSize: '2.8rem',
        fontWeight: 800,
        color: DarkText,
        textAlign: 'center',
        marginBottom: '20px',
    },
    // Navbar styles
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 40px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(5px)',
    },
    logoGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
    },
    logoIcon: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: PrimaryBlue,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
    },
    hospitalName: {
        fontSize: '1.5rem',
        fontWeight: 800,
        color: PrimaryBlue,
        margin: 0,
        letterSpacing: '-0.5px',
    },
    adminLoginButton: {
        padding: '10px 20px',
        backgroundColor: PrimaryBlue,
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
};

// Keyframe Animations (Injected via a <style> tag)
const GlobalAnimations = `
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
    
    .anim-hero-title { animation: slideInLeft 1s ease-out forwards; opacity: 0; animation-delay: 0.2s; }
    .anim-hero-text { animation: slideInLeft 1s ease-out forwards; opacity: 0; animation-delay: 0.4s; }
    .anim-hero-card-grid { animation: slideInLeft 1s ease-out forwards; opacity: 0; animation-delay: 0.6s; }
    .anim-hero-image { animation: slideInRight 1s ease-out forwards; opacity: 0; animation-delay: 0.2s; }
    
    @keyframes carouselEnter { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes carouselExit { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-20px); } }
`;

// ==========================================
// 2. CHILD COMPONENTS LOGIC
// ==========================================

const HeroSection = ({ navigate }) => {
    const heroStyles = {
        section: { ...GlobalStyles.section, padding: '100px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '60px', minHeight: '80vh' },
        textContainer: { flex: 1, minWidth: '400px' },
        mainTitle: { fontSize: '3.8rem', fontWeight: 900, color: DarkText, lineHeight: 1.1, marginBottom: '20px' },
        subText: { fontSize: '1.3rem', color: LightText, marginBottom: '40px' },
        loginCardsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
        loginCard: { backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)', padding: '30px', textAlign: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer', border: '1px solid #e2e8f0' },
        cardIcon: { width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', fontSize: '2.5rem' },
        patientIcon: { backgroundColor: PrimaryBlue, color: 'white' }, 
        doctorIcon: { backgroundColor: SecondaryGreen, color: 'white' }, 
        cardTitle: { fontSize: '1.6rem', fontWeight: 700, color: DarkText, marginBottom: '10px' },
        cardDescription: { fontSize: '1rem', color: LightText, marginBottom: '25px' },
        accessButton: (color) => ({ padding: '12px 25px', backgroundColor: color, color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '80%', margin: '0 auto' }),
        imageContainer: { flex: 1, minWidth: '400px', position: 'relative' },
        hospitalImage: { width: '100%', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)' },
    };

    const handleCardHover = (e, isEnter) => {
        e.currentTarget.style.transform = isEnter ? 'translateY(-8px)' : 'translateY(0)';
        e.currentTarget.style.boxShadow = isEnter ? '0 15px 40px rgba(0, 0, 0, 0.12)' : '0 10px 30px rgba(0, 0, 0, 0.08)';
    };

    return (
        <section style={heroStyles.section}>
            <div style={heroStyles.textContainer}>
                <h1 style={heroStyles.mainTitle} className="anim-hero-title">
                    Your Partner in <span style={{ color: PrimaryBlue }}>Health</span> and Wellness
                </h1>
                <p style={heroStyles.subText} className="anim-hero-text">
                    Connecting Patients, Doctors, and Administrators on one unified platform. Streamline healthcare management with our modern, intuitive system.
                </p>

                <div style={heroStyles.loginCardsGrid} className="anim-hero-card-grid">
                    <div
                        style={heroStyles.loginCard}
                        onClick={() => navigate('/login')}
                        onMouseEnter={(e) => handleCardHover(e, true)}
                        onMouseLeave={(e) => handleCardHover(e, false)}
                    >
                        <div style={{ ...heroStyles.cardIcon, ...heroStyles.patientIcon }}> <User size={30} color="white" /> </div>
                        <h3 style={heroStyles.cardTitle}>Patient Portal</h3>
                        <p style={heroStyles.cardDescription}>Book appointments and manage your health records.</p>
                        <button style={heroStyles.accessButton(PrimaryBlue)}>
                            Access Portal <ArrowRight size={20} />
                        </button>
                    </div>

                    <div
                        style={heroStyles.loginCard}
                        onClick={() => navigate('/doctorlogin')}
                        onMouseEnter={(e) => handleCardHover(e, true)}
                        onMouseLeave={(e) => handleCardHover(e, false)}
                    >
                        <div style={{ ...heroStyles.cardIcon, ...heroStyles.doctorIcon }}> <Stethoscope size={30} color="white" /> </div>
                        <h3 style={heroStyles.cardTitle}>Doctor Access</h3>
                        <p style={heroStyles.cardDescription}>Manage schedules and patient consultations.</p>
                        <button style={heroStyles.accessButton(SecondaryGreen)}>
                            Access Portal <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div style={heroStyles.imageContainer} className="anim-hero-image">
                <img
                    // ⭐ FIXED IMAGE URL: Using reliable Unsplash URL
                    src="https://imageio.forbes.com/specials-images/imageserve/651ae5f9c817fd613f5f0e9c/Doctor-holding-tablet-showing-brain-human-and-body-anatomy-futuristic-technology/960x0.jpg?height=399&width=711&fit=bounds"
                    alt="Doctor using digital management tablet"
                    style={heroStyles.hospitalImage}
                    // Removed redundant error handler as link is stable
                />
            </div>
        </section>
    );
};

const AboutUsSection = () => {
    const aboutUsStyles = {
        section: { ...GlobalStyles.section, backgroundColor: LightBg, textAlign: 'center' },
        featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' },
        featureCard: { backgroundColor: AccentBg, borderRadius: '15px', boxShadow: '0 8px 25px rgba(0, 0, 0, 0.04)', padding: '30px', transition: 'transform 0.3s ease, box-shadow 0.3s ease', border: '1px solid #e2e8f0' },
        iconBox: (color) => ({ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px auto', color: 'white' }),
        cardTitle: { fontSize: '1.6rem', fontWeight: 700, color: DarkText, marginBottom: '10px' },
        cardDescription: { fontSize: '1rem', color: LightText },
        iconColors: { patient: PrimaryBlue, technology: SecondaryGreen, specialists: '#f97316' },
    };

    const handleCardHover = (e, isEnter) => {
        e.currentTarget.style.transform = isEnter ? 'translateY(-5px)' : 'translateY(0)';
        e.currentTarget.style.boxShadow = isEnter ? '0 12px 35px rgba(0, 0, 0, 0.1)' : '0 8px 25px rgba(0, 0, 0, 0.04)';
    };

    return (
        <section style={aboutUsStyles.section}>
            <h2 style={GlobalStyles.title}>Why Choose <span style={{ color: PrimaryBlue }}>Medicare</span>?</h2>
            <p style={GlobalStyles.subtitle}>
                Built with modern technology to provide a seamless healthcare management experience.
            </p>

            <div style={aboutUsStyles.featuresGrid}>
                {/* Feature 1: Patient-Centered Care (HeartPulse) */}
                <div
                    style={aboutUsStyles.featureCard}
                    onMouseEnter={(e) => handleCardHover(e, true)}
                    onMouseLeave={(e) => handleCardHover(e, false)}
                >
                    <div style={aboutUsStyles.iconBox(aboutUsStyles.iconColors.patient)}> <HeartPulse size={36} color="white" /> </div>
                    <h3 style={aboutUsStyles.cardTitle}>Patient-Centered Care</h3>
                    <p style={aboutUsStyles.cardDescription}>
                        Easy appointment booking, health record management, and 24/7 access to your medical information.
                    </p>
                </div>

                {/* Feature 2: Advanced Technology (Shield) */}
                <div
                    style={aboutUsStyles.featureCard}
                    onMouseEnter={(e) => handleCardHover(e, true)}
                    onMouseLeave={(e) => handleCardHover(e, false)}
                >
                    <div style={aboutUsStyles.iconBox(aboutUsStyles.iconColors.technology)}> <Shield size={36} color="white" /> </div>
                    <h3 style={aboutUsStyles.cardTitle}>Security & Technology</h3>
                    <p style={aboutUsStyles.cardDescription}>
                        State-of-the-art medical equipment and digital health monitoring for accurate diagnostics.
                    </p>
                </div>

                {/* Feature 3: Expert Specialists (Ambulance) */}
                <div
                    style={aboutUsStyles.featureCard}
                    onMouseEnter={(e) => handleCardHover(e, true)}
                    onMouseLeave={(e) => handleCardHover(e, false)}
                >
                    <div style={aboutUsStyles.iconBox(aboutUsStyles.iconColors.specialists)}> <Ambulance size={36} color="white" /> </div>
                    <h3 style={aboutUsStyles.cardTitle}>24/7 Emergency Care</h3>
                    <p style={aboutUsStyles.cardDescription}>
                        Board-certified doctors with years of experience in their respective specialties.
                    </p>
                </div>
            </div>
        </section>
    );
};

const TestimonialsSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [animationState, setAnimationState] = useState('entering');

    const testimonialStyles = {
        section: { ...GlobalStyles.section, maxWidth: '1000px', textAlign: 'center' },
        carouselContainer: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px' },
        card: (idx) => ({ 
            backgroundColor: PastelColors[idx % PastelColors.length], 
            borderRadius: '15px', boxShadow: '0 15px 40px rgba(0, 0, 0, 0.08)', padding: '40px', width: '100%', maxWidth: '700px', border: '1px solid #e2e8f0', transition: 'opacity 0.7s ease-in-out, transform 0.7s ease-in-out', position: 'absolute' 
        }),
        quoteIcon: { color: '#e2e8f0', marginBottom: '20px' },
        quoteText: { fontSize: '1.4rem', fontStyle: 'italic', color: DarkText, marginBottom: '20px', lineHeight: 1.8 },
        ratingStars: { display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '15px' },
        starIcon: { color: '#fbbf24', fill: '#fbbf24' },
        authorName: { fontSize: '1.2rem', fontWeight: 700, color: DarkText, marginBottom: '5px' },
        authorRole: { fontSize: '0.9rem', color: LightText },
        navButton: { backgroundColor: 'rgba(0, 112, 199, 0.1)', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background-color 0.3s ease', position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 50 },
    };
    
    const testimonials = [
        { quote: "The online appointment system made it so easy to schedule my visits. ", author: "Sarah Johnson", rating: 5 },
        { quote: "Medicare's advanced technology and expert doctors provide peace of mind. ", author: "David Lee", rating: 5 },
        { quote: "I've been a patient for years, and the consistent quality of care is truly exceptional. ", author: "Maria Rodriguez", rating: 4 },
        { quote: "From initial consultation to follow-up, every step was seamless and efficient.", author: "James Wilson", rating: 5 },
    ];

    // ⭐ AUTOPLAY IMPLEMENTATION (Make it dynamic)
    useEffect(() => {
        const carouselInterval = setInterval(() => {
            setAnimationState('exiting');
            setTimeout(() => {
                setCurrentIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
            }, 700); // Wait for exit animation to finish
        }, 6000); // Change testimonial every 6 seconds

        return () => clearInterval(carouselInterval);
    }, [testimonials.length]);

    useEffect(() => {
        setAnimationState('entering');
        const timer = setTimeout(() => setAnimationState('idle'), 700);
        return () => clearTimeout(timer);
    }, [currentIndex]);

    const handleTransition = (direction) => {
        setAnimationState('exiting');
        setTimeout(() => {
            setCurrentIndex((prev) => {
                if (direction === 'next') {
                    return prev === testimonials.length - 1 ? 0 : prev + 1;
                } else {
                    return prev === 0 ? testimonials.length - 1 : prev - 1;
                }
            });
        }, 700);
    };

    const currentTestimonial = testimonials[currentIndex];

    const cardAnimation = animationState === 'entering' 
        ? { animation: 'carouselEnter 0.7s ease-in-out forwards' } 
        : animationState === 'exiting' 
        ? { animation: 'carouselExit 0.7s ease-in-out forwards', opacity: 0, transform: 'scale(0.9) translateY(20px)' }
        : {};

    return (
        <section style={testimonialStyles.section}>
            <h2 style={GlobalStyles.title}>What Our Patients Say</h2>
            <p style={GlobalStyles.subtitle}>
                Hear from those who trust us with their health and wellness journey.
            </p>

            <div style={testimonialStyles.carouselContainer}>
                <button
                    style={{ ...testimonialStyles.navButton, left: '0' }}
                    onClick={() => handleTransition('prev')}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 112, 199, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = testimonialStyles.navButton().backgroundColor}
                >
                    <ChevronLeft size={24} color={PrimaryBlue} />
                </button>

                <div style={{ ...testimonialStyles.card(currentIndex), ...cardAnimation }}>
                    <div style={testimonialStyles.quoteIcon}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-quote">
                            <path d="M3 21h3c6.2-4 9-10.2 9-17"/><path d="M15 21h3c6.2-4 9-10.2 9-17"/>
                        </svg>
                    </div>
                    <p style={testimonialStyles.quoteText}>"{currentTestimonial.quote}"</p>
                    <div style={testimonialStyles.ratingStars}>
                        {[...Array(currentTestimonial.rating)].map((_, i) => (
                            <Star key={`filled-${i}`} size={20} style={testimonialStyles.starIcon} />
                        ))}
                        {[...Array(5 - currentTestimonial.rating)].map((_, i) => (
                            <Star key={`empty-${i}`} size={20} color="#cbd5e1" />
                        ))}
                    </div>
                    <p style={testimonialStyles.authorName}>{currentTestimonial.author}</p>
                    <p style={testimonialStyles.authorRole}>Patient</p>
                </div>

                <button
                    style={{ ...testimonialStyles.navButton, right: '0' }}
                    onClick={() => handleTransition('next')}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 112, 199, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = testimonialStyles.navButton().backgroundColor}
                >
                    <ChevronRight size={24} color={PrimaryBlue} />
                </button>
            </div>
        </section>
    );
};

const Footer = () => {
    const footerStyles = {
        footer: {
            backgroundColor: DarkBg,
            color: '#cbd5e1',
            padding: '60px 40px',
            fontFamily: 'Inter, sans-serif',
            marginTop: '60px',
        },
        contentWrapper: {
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1.5fr repeat(3, 1fr)',
            gap: '40px',
            paddingBottom: '40px',
            borderBottom: '1px solid #334155',
        },
        logoSection: { display: 'flex', flexDirection: 'column' },
        logoGroup: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },
        logoIcon: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: PrimaryBlue, display: 'flex', alignItems: 'center', justifyContent: 'center' },
        hospitalName: { fontSize: '1.6rem', fontWeight: 700, color: 'white', margin: 0 },
        logoDescription: { fontSize: '0.95rem', lineHeight: 1.6, color: '#94a3b8' },
        columnTitle: { fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '20px' },
        linkList: { listStyle: 'none', padding: 0, margin: 0 },
        linkItem: { marginBottom: '12px' },
        link: { color: '#cbd5e1', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.3s ease' },
        contactItem: { display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '15px', fontSize: '0.95rem', color: '#cbd5e1' },
        contactIcon: { color: PrimaryBlue, marginTop: '3px' },
        copyrightSection: { maxWidth: '1200px', margin: '0 auto', paddingTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' },
        legalLink: { color: '#94a3b8', textDecoration: 'none', margin: '0 10px' },
    };

    const LinkItem = ({ href, children }) => (
        <li style={footerStyles.linkItem}>
            <a 
                href={href} 
                style={footerStyles.link}
                onMouseEnter={(e) => e.currentTarget.style.color = PrimaryBlue}
                onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}
            >
                {children}
            </a>
        </li>
    );

    return (
        <footer style={footerStyles.footer}>
            <div style={footerStyles.contentWrapper}>
                <div style={footerStyles.logoSection}>
                    <div style={footerStyles.logoGroup}>
                        <div style={footerStyles.logoIcon}> <HeartPulse size={24} color="white" /> </div>
                        <h2 style={footerStyles.hospitalName}>Medicare Hospital</h2>
                    </div>
                    <p style={footerStyles.logoDescription}>
                        Providing compassionate, quality healthcare services to our community for over 15 years.
                    </p>
                </div>

                <div>
                    <h3 style={footerStyles.columnTitle}>Quick Links</h3>
                    <ul style={footerStyles.linkList}>
                        <LinkItem href="#">About Us</LinkItem>
                        <LinkItem href="#">Services</LinkItem>
                        <LinkItem href="#">Departments</LinkItem>
                        <LinkItem href="#">Careers</LinkItem>
                    </ul>
                </div>

                <div>
                    <h3 style={footerStyles.columnTitle}>Patient Access</h3>
                    <ul style={footerStyles.linkList}>
                        <LinkItem href="/login">Patient Portal</LinkItem>
                        <LinkItem href="/doctorlogin">Doctor Login</LinkItem>
                        <LinkItem href="/admin">Admin Access</LinkItem>
                        <LinkItem href="#">FAQs</LinkItem>
                    </ul>
                </div>

                <div>
                    <h3 style={footerStyles.columnTitle}>Contact Us</h3>
                    <div style={footerStyles.contactItem}>
                        <MapPin size={18} style={footerStyles.contactIcon} />
                        <span>123 Healthcare Blvd, Medical City, <br/> NC 12345</span>
                    </div>
                    <div style={footerStyles.contactItem}>
                        <Phone size={18} style={footerStyles.contactIcon} />
                        <span>+1 (555) 123-4567</span>
                    </div>
                    <div style={footerStyles.contactItem}>
                        <Mail size={18} style={footerStyles.contactIcon} />
                        <span>contact@medicare.health</span>
                    </div>
                </div>
            </div>

            <div style={footerStyles.copyrightSection}>
                &copy; 2023 Medicare Hospital. All rights reserved. |
                <a href="#" style={footerStyles.legalLink}>Privacy Policy</a> |
                <a href="#" style={footerStyles.legalLink}>Terms of Service</a>
            </div>
        </footer>
    );
};

// ==========================================
// 4. MAIN LANDING PAGE COMPONENT
// ==========================================

const LandingPage = () => {
    const navigate = useNavigate();

    const goToAdminLogin = () => navigate('/admin'); 
    const goToHome = () => navigate('/'); 

    return (
        <div style={GlobalStyles.container}>
            <style>{GlobalAnimations}</style> {/* Inject animations */}

            {/* Navbar */}
            <nav style={GlobalStyles.navbar}>
                <div style={GlobalStyles.logoGroup} onClick={goToHome}>
                    <div style={GlobalStyles.logoIcon}>
                        <HeartPulse size={24} color="white" /> 
                    </div>
                    <h1 style={GlobalStyles.hospitalName}>Medicare Hospital</h1>
                </div>
                <button
                    style={GlobalStyles.adminLoginButton}
                    onClick={goToAdminLogin}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'} 
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = PrimaryBlue}
                >
                    <LogIn size={18} style={{marginRight: '5px'}}/> Admin Login
                </button>
            </nav>

            {/* Sections */}
            <HeroSection navigate={navigate} />
            <AboutUsSection />
            <TestimonialsSection />
            <Footer />
        </div>
    );
};

export default LandingPage;