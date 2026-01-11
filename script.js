// === Smooth Scrolling for Navigation Links ===
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// === Typewriter Effect ===
function initTypewriterEffect() {
    const heroText = "BCA Student | Full Stack Developer | Problem Solver";
    const heroSubtitle = document.querySelector('#hero p');
    
    if (!heroSubtitle) return;
    
    // Clear existing content
    heroSubtitle.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < heroText.length) {
            heroSubtitle.textContent += heroText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    // Start animation after 1 second
    setTimeout(() => {
        typeWriter();
    }, 1000);
}

// === Scroll Animation ===
function initScrollAnimations() {
    const animateElements = document.querySelectorAll(
        '.certificate-card, .project-card, .about-content, .links-container, .contact-form, .link-card'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    animateElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(element);
    });
}

// === Certificate Filter Functionality ===
function initCertificateFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const certificateCards = document.querySelectorAll('.certificate-card');
    const certificateCategories = document.querySelectorAll('.certificate-category');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            // Show/hide certificates based on filter
            if (filterValue === 'all') {
                certificateCategories.forEach(category => {
                    category.style.display = 'block';
                });
                certificateCards.forEach(card => {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                });
            } else {
                certificateCategories.forEach(category => {
                    const categoryType = category.getAttribute('data-category');
                    if (categoryType === filterValue) {
                        category.style.display = 'block';
                    } else {
                        category.style.display = 'none';
                    }
                });
                
                certificateCards.forEach(card => {
                    const cardCategory = card.closest('.certificate-category').getAttribute('data-category');
                    if (cardCategory === filterValue) {
                        card.style.display = 'flex';
                        card.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    });
}

// === Certificate Modal View ===
function initCertificateModal() {
    const certificateLinks = document.querySelectorAll('.certificate-link');
    
    certificateLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only prevent default if it's not an external link
            if (!link.getAttribute('href').startsWith('http')) {
                e.preventDefault();
                
                const card = link.closest('.certificate-card');
                const title = card.querySelector('h4').textContent;
                const issuer = card.querySelector('.certificate-issuer').textContent;
                const date = card.querySelector('.certificate-date').textContent;
                const imgSrc = card.querySelector('.certificate-img').src;
                
                // Create modal
                const modal = document.createElement('div');
                modal.className = 'certificate-modal';
                modal.innerHTML = `
                    <div class="modal-content">
                        <span class="close-modal">&times;</span>
                        <h3>${title}</h3>
                        <div class="modal-meta">
                            <span><i class="fas fa-university"></i> ${issuer}</span>
                            <span><i class="far fa-calendar"></i> ${date}</span>
                        </div>
                        <div class="modal-image">
                            <img src="${imgSrc}" alt="${title}">
                        </div>
                        <div class="modal-actions">
                            <button class="btn download-btn">
                                <i class="fas fa-download"></i> Download Certificate
                            </button>
                            <button class="btn share-btn">
                                <i class="fas fa-share-alt"></i> Share
                            </button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(modal);
                
                // Close modal functionality
                const closeBtn = modal.querySelector('.close-modal');
                closeBtn.addEventListener('click', () => {
                    document.body.removeChild(modal);
                });
                
                // Close when clicking outside
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        document.body.removeChild(modal);
                    }
                });
                
                // Download functionality
                const downloadBtn = modal.querySelector('.download-btn');
                downloadBtn.addEventListener('click', () => {
                    // Create a temporary link element
                    const downloadLink = document.createElement('a');
                    downloadLink.href = imgSrc;
                    downloadLink.download = `${title.replace(/\s+/g, '_')}_certificate.jpg`;
                    downloadLink.click();
                });
                
                // Share functionality
                const shareBtn = modal.querySelector('.share-btn');
                shareBtn.addEventListener('click', () => {
                    if (navigator.share) {
                        navigator.share({
                            title: title,
                            text: `Check out my ${title} certificate from ${issuer}`,
                            url: window.location.href
                        });
                    } else {
                        // Fallback: Copy to clipboard
                        const shareText = `${title} - ${issuer} - ${date}\n${window.location.href}`;
                        navigator.clipboard.writeText(shareText).then(() => {
                            alert('Certificate details copied to clipboard!');
                        });
                    }
                });
                
                // Add modal styles dynamically
                if (!document.querySelector('#modal-styles')) {
                    const style = document.createElement('style');
                    style.id = 'modal-styles';
                    style.textContent = `
                        .certificate-modal {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0, 0, 0, 0.95);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            z-index: 1000;
                            animation: fadeIn 0.3s ease;
                        }
                        
                        .modal-content {
                            background: var(--card-bg);
                            padding: 3rem;
                            border-radius: 20px;
                            max-width: 800px;
                            width: 90%;
                            max-height: 90vh;
                            overflow-y: auto;
                            position: relative;
                            border: 2px solid var(--primary);
                            backdrop-filter: blur(10px);
                        }
                        
                        .close-modal {
                            position: absolute;
                            top: 20px;
                            right: 20px;
                            font-size: 2.5rem;
                            color: var(--primary);
                            cursor: pointer;
                            transition: all 0.3s ease;
                            background: none;
                            border: none;
                            width: 40px;
                            height: 40px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 1001;
                        }
                        
                        .close-modal:hover {
                            color: var(--secondary);
                            transform: scale(1.2);
                        }
                        
                        .modal-content h3 {
                            font-size: 2.2rem;
                            margin-bottom: 1.5rem;
                            color: var(--light);
                            text-align: center;
                        }
                        
                        .modal-meta {
                            display: flex;
                            justify-content: center;
                            gap: 3rem;
                            margin-bottom: 2rem;
                            color: var(--gray);
                            font-size: 1.1rem;
                        }
                        
                        .modal-meta span {
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
                        }
                        
                        .modal-meta i {
                            color: var(--primary);
                        }
                        
                        .modal-image {
                            margin-bottom: 2rem;
                            border-radius: 10px;
                            overflow: hidden;
                            border: 1px solid rgba(255, 255, 255, 0.1);
                        }
                        
                        .modal-image img {
                            width: 100%;
                            height: auto;
                            display: block;
                        }
                        
                        .modal-actions {
                            display: flex;
                            gap: 1.5rem;
                            justify-content: center;
                        }
                        
                        .modal-actions .btn {
                            padding: 1rem 2rem;
                            font-size: 1rem;
                        }
                        
                        @media (max-width: 768px) {
                            .modal-content {
                                padding: 2rem;
                            }
                            
                            .modal-content h3 {
                                font-size: 1.8rem;
                            }
                            
                            .modal-meta {
                                flex-direction: column;
                                gap: 1rem;
                                align-items: center;
                            }
                            
                            .modal-actions {
                                flex-direction: column;
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
        });
    });
}

// === Certificate Counter Animation ===
function animateCertificateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const originalText = stat.textContent;
        const target = parseInt(originalText);
        if (isNaN(target)) return;
        
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current) + (originalText.includes('+') ? '+' : '');
        }, 30);
    });
}

// === Form Submission ===
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Show success message
        alert(`Thank you ${name}! Your message has been sent successfully.\n\nI'll get back to you at ${email} soon.`);
        
        // Reset form
        contactForm.reset();
        
        // Optional: Send data to FormSubmit.co or your backend
        /*
        const formData = new FormData(contactForm);
        fetch('https://formsubmit.co/your-email@example.com', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                alert('Message sent successfully!');
                contactForm.reset();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            alert('There was a problem sending your message. Please try again later.');
            console.error('Error:', error);
        });
        */
    });
}

// === Initialize Navbar Scroll Effect ===
function initNavbarScroll() {
    const nav = document.querySelector('nav');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show/hide navbar on scroll
        if (scrollTop > 100) {
            nav.style.backgroundColor = 'rgba(18, 31, 61, 0.98)';
            nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.4)';
        } else {
            nav.style.backgroundColor = 'rgba(18, 31, 61, 0.95)';
            nav.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
}

// === Add current year to certificates (optional) ===
function updateCertificateYears() {
    const certificateDates = document.querySelectorAll('.certificate-date');
    const currentYear = new Date().getFullYear();
    
    certificateDates.forEach(dateElement => {
        const text = dateElement.textContent;
        // If date doesn't have a year, add current year
        if (text && !text.match(/\d{4}$/)) {
            dateElement.textContent = text + ' ' + currentYear;
        }
    });
}

// === Update Coding Profile Links ===
function updateProfileLinks() {
    // Update these with your actual profile URLs
    const profileLinks = {
        'hackerrank': 'https://www.hackerrank.com/profile/your-username',
        'gfg': 'https://auth.geeksforgeeks.org/user/your-username',
        'leetcode': 'https://leetcode.com/u/your-username/',
        'github': 'https://github.com/piyush12-ux',
        'linkedin': 'https://www.linkedin.com/in/piyush-yadav-397865340/',
        'instagram': 'https://www.instagram.com/piyushyadav1912/',
        'email': 'mailto:py077865@gmail.com'
    };
    
    // Update all social links
    document.querySelectorAll('.link-card a').forEach(link => {
        const platform = link.textContent.toLowerCase();
        if (profileLinks[platform]) {
            link.href = profileLinks[platform];
        }
    });
}

// === Initialize all functions when DOM is loaded ===
document.addEventListener('DOMContentLoaded', () => {
    initTypewriterEffect();
    initScrollAnimations();
    initContactForm();
    initNavbarScroll();
    updateCertificateYears();
    initCertificateFilter();
    initCertificateModal();
    updateProfileLinks();
    
    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });
    
    // Animate stats when certificates section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCertificateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const certificatesSection = document.getElementById('certificates');
    if (certificatesSection) {
        observer.observe(certificatesSection);
    }
    
    // Add active navigation based on scroll position
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});

// === Add active class to nav links ===
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});