document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    // Stripe-style dropdown logic
    const dropdownItems = document.querySelectorAll('.has-dropdown');
    const popover = document.getElementById('dropdown-popover');
    const popoverBg = popover.querySelector('.popover-bg');
    const popoverArrow = popover.querySelector('.popover-arrow');
    const popoverContent = popover.querySelector('.popover-content');
    const sections = document.querySelectorAll('.dropdown-section');
    const mobileBreakpoint = window.matchMedia('(max-width: 991px)');

    function isMobileView() {
        return mobileBreakpoint.matches;
    }

    function openDropdown(item) {
        if (isMobileView()) {
            return;
        }

        const dropdownName = item.dataset.dropdown;
        const targetSection = document.querySelector(`.dropdown-section[data-section="${dropdownName}"]`);
        
        if (!targetSection) return;

        // Activate correct section
        sections.forEach(s => {
            s.classList.remove('active');
            s.style.display = 'none'; // Ensure other sections don't interfere
        });
        targetSection.style.display = 'block';
        // Force reflow for opacity transition
        targetSection.offsetHeight; 
        targetSection.classList.add('active');
        
        // Show the popover
        popover.classList.add('open');

        // Measure section accurately
        const width = targetSection.offsetWidth;
        const height = targetSection.offsetHeight;
        
        // Get trigger item center relative to viewport
        const itemRect = item.getBoundingClientRect();
        
        // Calculate popover position
        const leftValue = itemRect.left + (itemRect.width / 2) - (width / 2);
        const arrowLeft = (width / 2); // Center of the popover

        // Apply morphing styles
        popover.style.left = `${leftValue}px`;
        popoverBg.style.width = `${width}px`;
        popoverBg.style.height = `${height}px`;
        popoverContent.style.width = `${width}px`;
        popoverContent.style.height = `${height}px`;
        
        // Position the arrow
        popoverArrow.style.left = `${arrowLeft}px`;
    }

    function closeDropdown() {
        popover.classList.remove('open');
        sections.forEach(s => s.classList.remove('active'));
    }

    function closeMobileMenu() {
        if (!navLinks) return;
        navLinks.classList.remove('active');
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.classList.remove('menu-open');
    }

    dropdownItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            clearTimeout(closeTimeout);
            openDropdown(item);
        });
    });

    // Close logic for entire header/popover area
    let closeTimeout;

    header.addEventListener('mouseleave', (e) => {
        if (!popover.contains(e.relatedTarget)) {
            closeTimeout = setTimeout(closeDropdown, 300);
        }
    });

    popover.addEventListener('mouseenter', () => {
        clearTimeout(closeTimeout);
    });

    popover.addEventListener('mouseleave', (e) => {
        if (![...dropdownItems].some(item => item.contains(e.relatedTarget))) {
            closeTimeout = setTimeout(closeDropdown, 300);
        }
    });

    // Scroll effect for header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isOpen = navLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('menu-open', isOpen);
            if (isOpen) {
                closeDropdown();
            }
        });
    }

    if (navLinks) {
        navLinks.querySelectorAll('a, button').forEach(element => {
            element.addEventListener('click', () => {
                if (isMobileView()) {
                    closeMobileMenu();
                }
            });
        });
    }

    window.addEventListener('resize', () => {
        if (!isMobileView()) {
            closeMobileMenu();
        } else {
            closeDropdown();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
            closeDropdown();
        }
    });

    // Scroll reveal animations using Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Article Reader System
    const articles = {
        'cloud': {
            tag: 'Cloud',
            title: 'Scaling Multi-Cloud Infrastructure',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
            date: 'March 15, 2024',
            readTime: '8 min read',
            content: `
                <p>In today's digital landscape, the move towards multi-cloud strategies isn't just a trend—it's a necessity for enterprise resilience. By leveraging the unique strengths of AWS, Azure, and Google Cloud, organizations can avoid vendor lock-in and optimize costs.</p>
                <p>However, multi-cloud brings significant complexity. Our engineering team at SkyBridge focuses on three core pillars: Unified Observability, Cross-Cloud Networking, and Consistent Security Policy Enforcement.</p>
                <p>Scalability requires a shift towards Infrastructure as Code (IaC). We recommend using Terraform or Pulumi to maintain a single source of truth for your multi-cloud environment, ensuring that a change in one region is reflected across the entire infrastructure.</p>
            `
        },
        'security': {
            tag: 'Security',
            title: 'The Zero Trust Security Framework',
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
            date: 'March 12, 2024',
            readTime: '6 min read',
            content: `
                <p>The traditional "castle and moat" security model is dead. In a world of remote work and cloud-native apps, the perimeter has dissolved. Enter Zero Trust: Never Trust, Always Verify.</p>
                <p>At SkyBridge, we implement Zero Trust by focusing on identity-centric security. Every request to access a resource must be authenticated, authorized, and continuously validated before granting access.</p>
                <p>Key components include Multi-Factor Authentication (MFA), Micro-segmentation, and Least Privilege Access. These aren't just tools; they are a fundamental shift in how we protect digital assets.</p>
            `
        },
        'ai': {
            tag: 'AI / ML',
            title: 'Integrating LLMs into Software',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
            date: 'March 10, 2024',
            readTime: '10 min read',
            content: `
                <p>Generative AI is transforming how we build software, but integrating Large Language Models (LLMs) requires more than just an API call. It requires careful orchestration of data, prompts, and feedback loops.</p>
                <p>We've found that Retrieval-Augmented Generation (RAG) is the most effective way to combine private enterprise data with the reasoning capabilities of LLMs. This ensures that the AI answers are grounded in your specific business context.</p>
                <p>Security and cost are also major factors. Implementing rate limiting and monitoring prompt token usage are essential steps for any production-grade AI integration.</p>
            `
        },
        'design': {
            tag: 'UI/UX',
            title: 'Design Patterns for Enterprise',
            image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800',
            date: 'March 08, 2024',
            readTime: '5 min read',
            content: `
                <p>Enterprise software doesn't have to be clunky. In fact, for complex dashboard systems, intuitive design is a productivity multiplier. Our design philosophy centers on "Clarity over Complexity."</p>
                <p>Effective enterprise UI relies on a strong grid system and consistent information hierarchy. By grouping related actions and using subtle color cues for status, we reduce the cognitive load on power users.</p>
                <p>Micro-interactions also play a huge role. Subtle animations that show a system's state or the result of an action provide immediate feedback, making the experience feel responsive and alive.</p>
            `
        },
        'news-emea': {
            tag: 'Announcement',
            title: 'Expanding Operations to EMEA Regions',
            image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800',
            date: 'April 02, 2024',
            readTime: '4 min read',
            content: `
                <p>We are thrilled to announce a significant milestone in SkyBridge's global journey. This month marks the official opening of our EMEA headquarters in the heart of London’s tech hub.</p>
                <p>This expansion is driven by a 300% increase in demand from our European partners for sovereign cloud solutions and localized zero-trust architecture. Our London team will consist of over 50 expert engineers and dedicated support staff to provide real-time assistance to the EMEA market.</p>
                <p>"The future of tech is global, but the implementation must be local," says the SkyBridge CEO. "Our London base allows us to bridge the gap between innovation and local compliance requirements."</p>
            `
        },
        'news-bridge-2': {
            tag: 'Product Update',
            title: 'Introducing Bridge-AI 2.0',
            image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&q=80&w=800',
            date: 'March 28, 2024',
            readTime: '7 min read',
            content: `
                <p>The next generation of AI integration is here. Bridge-AI 2.0 represents a fundamental shift in how enterprise data interacts with Large Language Models. We've completely rebuilt the core engine to prioritize low-latency and high-precision outputs.</p>
                <p>New key features include Native RAG (Retrieval-Augmented Generation) support, which allows the AI to ground its answers in your private documents without expensive retraining. We've also introduced "Intelligent Token Routing," which reduces API costs by up to 25% by optimizing prompt structures.</p>
                <p>Existing customers will receive an automatic upgrade throughout the week. Check your developer dashboard for the new v2 API keys.</p>
            `
        },
        'news-innovator': {
            tag: 'Company',
            title: "Named 'Innovator of the Year'",
            image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
            date: 'March 20, 2024',
            readTime: '3 min read',
            content: `
                <p>We are deeply honored to have been named "Innovator of the Year" at the 2024 Tech Excellence Awards. This recognition is a testament to the tireless work of our engineering team in redefining what's possible in cloud-native security.</p>
                <p>The award highlights our unique approach to multi-cloud modernization, specifically our work in creating seamless zero-trust bridges for legacy enterprise systems. We stood out among 500 nominees for our commitment to "security that enables speed, rather than hindering it."</p>
                <p>A huge thank you to our partners and clients who trust us with their critical infrastructure every day. We're just getting started!</p>
            `
        }
    };

    const modalOverlay = document.getElementById('article-modal');
    const modalContent = modalOverlay ? modalOverlay.querySelector('.modal-window') : null;
    const closeModalBtn = modalOverlay ? modalOverlay.querySelector('.modal-close') : null;

    // Tool & Checklist Data
    const tools = {
        'audit-checklist': {
            title: 'Security Audit Checklist',
            content: `
                <ul class="modal-list">
                    <li><strong>Network Perimeter</strong>: Verify firewall rules and open ports.</li>
                    <li><strong>Identity Management</strong>: Audit MFA adoption across all accounts.</li>
                    <li><strong>Encryption</strong>: Ensure data-at-rest and data-in-transit encryption is active.</li>
                    <li><strong>Logging</strong>: Confirm SIEM integration for all critical services.</li>
                    <li><strong>Access Review</strong>: Perform quarterly "Least Privilege" audit.</li>
                </ul>
                <div class="modal-action-box">
                    <button class="btn btn-primary" onclick="window.print()">Export to PDF</button>
                </div>
            `
        },
        'cloud-calculator': {
            title: 'Cloud Budgeting Template',
            content: `
                <p>Use these reference metrics to baseline your monthly cloud expenditure across AWS and Azure.</p>
                <div class="modal-table-wrapper">
                    <table class="modal-table">
                        <tr><td>Compute (EC2/VM)</td><td>35% of Total</td></tr>
                        <tr><td>Storage (S3/Managed Disk)</td><td>20% of Total</td></tr>
                        <tr><td>Networking (Data Transfer)</td><td>15% of Total</td></tr>
                        <tr><td>Managed Services (RDS/AKS)</td><td>30% of Total</td></tr>
                    </table>
                </div>
                <p class="mt-20"><em>*Based on SkyBridge 2023 Enterprise Benchmarks.</em></p>
            `
        },
        'api-blueprint': {
            title: 'API Integration Blueprint',
            content: `
                <p>Standardized architecture for RESTful service integration within SkyBridge ecosystems.</p>
                <div class="code-block">
                    {
                      "version": "v1.2",
                      "auth": "OAuth2.0",
                      "retry_policy": "Exponential Backoff",
                      "monitoring": "Prometheus/Grafana"
                    }
                </div>
                <p>Follow these standards to ensure 99.99% compatibility with our Bridge-AI layer.</p>
            `
        },
        'dev-velocity': {
            title: 'Team Velocity Tracker',
            content: `
                <p>Measure and optimize your sprint delivery performance with these key Agile metrics.</p>
                <ul class="modal-list">
                    <li><strong>Cycle Time</strong>: Days from "In Progress" to "Done".</li>
                    <li><strong>Lead Time</strong>: Days from "Backlog" to "Done".</li>
                    <li><strong>WIP Limit</strong>: Maximum 3 active tasks per developer.</li>
                    <li><strong>Deployment Freq</strong>: Targets 1+ production push per day.</li>
                </ul>
            `
        }
    };

    window.openTool = function(toolId) {
        const tool = tools[toolId];
        if (!tool || !modalOverlay) return; // Changed articleModal to modalOverlay for consistency

        modalOverlay.querySelector('.modal-hero').style.display = 'none';
        modalOverlay.querySelector('.modal-tag').textContent = 'Tool / Template';
        modalOverlay.querySelector('.modal-title').textContent = tool.title;
        // Assuming there's a .modal-meta element to populate
        const modalMeta = modalOverlay.querySelector('.modal-meta');
        if (modalMeta) {
            modalMeta.innerHTML = '<span>Practical Resource</span>';
        }
        modalOverlay.querySelector('.modal-body').innerHTML = tool.content;

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // Correcting openArticle to restore hero visibility if hidden by tool
    const originalOpenArticle = window.openArticle;
    window.openArticle = function(id) {
        if (modalOverlay) modalOverlay.querySelector('.modal-hero').style.display = 'block'; // Changed articleModal to modalOverlay
        originalOpenArticle(id);
    };

    function openArticle(id) {
        const article = articles[id];
        if (!article || !modalOverlay) return;

        // Populate modal
        modalOverlay.querySelector('.modal-hero').src = article.image;
        modalOverlay.querySelector('.modal-tag').textContent = article.tag;
        modalOverlay.querySelector('.modal-title').textContent = article.title;
        modalOverlay.querySelector('.modal-date').textContent = article.date;
        modalOverlay.querySelector('.modal-read-time').textContent = article.readTime;
        modalOverlay.querySelector('.modal-body').innerHTML = article.content;

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }

    function closeArticle() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }

    // Event Listeners for Blog and News
    document.querySelectorAll('.blog-card, .news-feed-item').forEach(card => {
        card.addEventListener('click', (e) => {
            const articleId = card.dataset.articleId;
            if (articleId) openArticle(articleId);
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeArticle);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeArticle();
        });
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeArticle();
    });

    // Lead Generation System
    const downloadModal = document.getElementById('download-modal');
    const leadForm = document.getElementById('lead-form');

    window.openDownloadModal = function(ebookTitle) {
        if (!downloadModal) return;
        downloadModal.querySelector('.modal-title').textContent = `Download: ${ebookTitle}`;
        downloadModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeDownloadModal = function() {
        if (!downloadModal) return;
        downloadModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = leadForm.querySelector('input[type="email"]').value;
            if (email) {
                const btn = leadForm.querySelector('button');
                const originalText = btn.textContent;
                btn.textContent = 'Preparing Download...';
                btn.disabled = true;

                setTimeout(() => {
                    btn.textContent = 'Success! Check your Email.';
                    btn.style.background = '#10b981';
                    setTimeout(() => {
                        closeDownloadModal();
                        // Reset form
                        btn.textContent = originalText;
                        btn.style.background = '';
                        btn.disabled = false;
                        leadForm.reset();
                    }, 2000);
                }, 1500);
            }
        });
    }

    // Modal listeners handled by class toggle logic in modal section but adding specific for download
    if (downloadModal) {
        downloadModal.addEventListener('click', (e) => {
            if (e.target === downloadModal) closeDownloadModal();
        });
    }

    // Case Studies Data
    const cases = {
        'fintech-scale': {
            title: 'Scaling for 300% Traffic Growth',
            tag: 'Cloud Scalability',
            content: `
                <h3>The Challenge</h3>
                <p>Global FinTech was experiencing recurring downtime during peak market hours as their legacy infrastructure struggled with a 300% surge in user traffic.</p>
                <h3>Our Solution</h3>
                <p>We implemented a multi-region auto-scaling architecture on AWS, utilizing Kubernetes for container orchestration and CloudFront for edge delivery.</p>
                <div class="result-box">
                    <h4>Direct Impact</h4>
                    <ul>
                        <li>99.99% Uptime achieved during peak load.</li>
                        <li>45% reduction in latency for Asian markets.</li>
                        <li>Zero downtime during the migration period.</li>
                    </ul>
                </div>
            `
        },
        'eco-logistics': {
            title: 'AI-Driven Route Optimization',
            tag: 'AI / Logistics',
            content: `
                <h3>The Challenge</h3>
                <p>EcoLogistics faced rising fuel costs and inefficient delivery windows across their European fulfillment network.</p>
                <h3>Our Solution</h3>
                <p>Leveraging Bridge-AI 2.0, we deployed a real-time route optimization engine that factored in live traffic, weather, and vehicle capacity.</p>
                <div class="result-box">
                    <h4>Direct Impact</h4>
                    <ul>
                        <li>20% reduction in overall fuel consumption.</li>
                        <li>15,000+ metric tons of CO2 saved annually.</li>
                        <li>98% on-time delivery rate maintained.</li>
                    </ul>
                </div>
            `
        },
        'health-sync': {
            title: 'Zero-Trust Security Overhaul',
            tag: 'Cybersecurity',
            content: `
                <h3>The Challenge</h3>
                <p>HealthSync needed a total security modernization to protect sensitive patient data across 40+ medical facilities.</p>
                <h3>Our Solution</h3>
                <p>We designed and implemented a full Zero-Trust architecture, incorporating biometric MFA, micro-segmentation, and continuous threat monitoring.</p>
                <div class="result-box">
                    <h4>Direct Impact</h4>
                    <ul>
                        <li>0 Security breaches in 24 months.</li>
                        <li>100% Compliance with updated HIPAA standards.</li>
                        <li>30% Faster authorization for medical staff.</li>
                    </ul>
                </div>
            `
        }
    };

    window.openCase = function(caseId) {
        const caseStudy = cases[caseId];
        if (!caseStudy || !modalOverlay) return;

        modalOverlay.querySelector('.modal-hero').style.display = 'none';
        modalOverlay.querySelector('.modal-tag').textContent = 'Case Study';
        modalOverlay.querySelector('.modal-title').textContent = caseStudy.title;
        const modalMeta = modalOverlay.querySelector('.modal-meta');
        if (modalMeta) {
            modalMeta.innerHTML = `<span>${caseStudy.tag} Success Story</span>`;
        }
        modalOverlay.querySelector('.modal-body').innerHTML = caseStudy.content;

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // Auth / Sign-in System
    const authModal = document.getElementById('auth-modal');
    const authForm = document.getElementById('auth-form');

    window.openSignInModal = function() {
        if (!authModal) return;
        authModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeSignInModal = function() {
        if (!authModal) return;
        authModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Welcome Modal System
    const welcomeModal = document.getElementById('welcome-modal');
    window.closeWelcomeModal = function() {
        if (!welcomeModal) return;
        welcomeModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Trigger welcome modal on every homepage visit
    if (welcomeModal) {
        setTimeout(() => {
            welcomeModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 2000); // 2 second delay for better expert-led UX
    }

    // Settings Modal System
    const settingsModal = document.getElementById('settings-modal');
    window.openSettingsModal = function() {
        if (!settingsModal) return;
        settingsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeSettingsModal = function() {
        if (!settingsModal) return;
        settingsModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) closeSettingsModal();
        });

        const saveBtn = document.getElementById('save-settings-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const originalText = saveBtn.textContent;
                saveBtn.disabled = true;
                saveBtn.textContent = 'Saving...';
                setTimeout(() => {
                    alert('Settings updated successfully!');
                    saveBtn.disabled = false;
                    saveBtn.textContent = originalText;
                    closeSettingsModal();
                    
                    // Update profile name in header if changed
                    const newName = document.getElementById('settings-name').value;
                    if (newName) {
                        const userProfile = document.getElementById('user-profile');
                        userProfile.querySelector('.user-name').textContent = newName;
                        userProfile.querySelector('.user-avatar').textContent = newName.split(' ').map(n => n[0]).join('');
                    }
                }, 1000);
            });
        }
    }

    function onLoginSuccess(name = 'John Doe') {
        const headerSignIn = document.getElementById('header-signin');
        const userProfile = document.getElementById('user-profile');
        const userDropdown = document.getElementById('user-dropdown');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (headerSignIn) headerSignIn.style.display = 'none';
        if (userProfile) {
            userProfile.querySelector('.user-name').textContent = name;
            // Enhanced Avatar and Display Logic for Emails
            let displayInitials = name.includes('@') ? name[0].toUpperCase() : name.split(' ').map(n => n[0]).join('');
            userProfile.querySelector('.user-avatar').textContent = displayInitials;
            userProfile.classList.add('active');

            // Handle dropdown toggle
            userProfile.onclick = (e) => {
                e.stopPropagation();
                if (userDropdown) userDropdown.classList.toggle('active');
            };

            const settingsBtn = document.getElementById('settings-btn');
            if (settingsBtn) {
                settingsBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (userDropdown) userDropdown.classList.remove('active');
                    openSettingsModal();
                };
            }
        }

        // Handle logout
        if (logoutBtn) {
            logoutBtn.onclick = () => {
                if (confirm('Are you sure you want to log out?')) {
                    if (userProfile) userProfile.classList.remove('active');
                    if (userDropdown) userDropdown.classList.remove('active');
                    if (headerSignIn) headerSignIn.style.display = 'block';
                    alert('Logged out successfully.');
                }
            };
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (userDropdown && !userDropdown.contains(e.target) && e.target !== userProfile) {
                userDropdown.classList.remove('active');
            }
        });
    }

    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = authForm.querySelector('input[type="email"]');
            const submitBtn = authForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            const userEmail = emailInput ? emailInput.value : 'user@example.com';
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Authenticating...';
            
            setTimeout(() => {
                alert(`Success: Welcome to SkyBridge Technologies! Signed in as ${userEmail}`);
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                onLoginSuccess(userEmail);
                closeSignInModal();
            }, 1500);
        });
    }

    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) closeSignInModal();
        });
    }

    // Social Auth Simulation
    const googleLogin = document.getElementById('google-login');
    const githubLogin = document.getElementById('github-login');

    if (googleLogin) {
        googleLogin.addEventListener('click', () => {
            const originalContent = googleLogin.innerHTML;
            googleLogin.disabled = true;
            googleLogin.innerHTML = 'Connecting to Google...';
            setTimeout(() => {
                alert('Successfully connected via Google!');
                googleLogin.disabled = false;
                googleLogin.innerHTML = originalContent;
                onLoginSuccess('G. User');
                closeSignInModal();
            }, 1500);
        });
    }

    if (githubLogin) {
        githubLogin.addEventListener('click', () => {
            const originalContent = githubLogin.innerHTML;
            githubLogin.disabled = true;
            githubLogin.innerHTML = 'Connecting to GitHub...';
            setTimeout(() => {
                alert('Successfully connected via GitHub!');
                githubLogin.disabled = false;
                githubLogin.innerHTML = originalContent;
                onLoginSuccess('Git Hubber');
                closeSignInModal();
            }, 1500);
        });
    }

    // Video Gallery System
    const videoModal = document.getElementById('video-modal');
    const videoFrame = videoModal ? videoModal.querySelector('.video-player-frame') : null;

    const videos = {
        'migration-masterclass': {
            title: 'AWS Architecture Masterclass',
            url: 'https://www.youtube-nocookie.com/embed/3XFODda6YXo?autoplay=1' // User Requested: AWS Architecture Masterclass
        },
        'ai-integration-demo': {
            title: 'AI Integration Demo',
            url: 'https://www.youtube-nocookie.com/embed/DQacCB9tDaw?autoplay=1' // OpenAI Official GPT-4o
        },
        'security-setup': {
            title: 'Microsoft Zero Trust Security',
            url: 'https://www.youtube-nocookie.com/embed/0-IYLWMHxGg?list=PL3ZTgFEc7LyuZlK_W0nUN_VV6hscz-rQP&autoplay=1' // User Requested: Microsoft Security Playlist
        }
    };

    window.openVideo = function(videoId) {
        const video = videos[videoId];
        if (!video || !videoModal) return;

        videoModal.querySelector('.modal-title').textContent = video.title;
        if (videoFrame) {
            videoFrame.src = video.url;
        }

        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeVideo = function() {
        if (!videoModal) return;
        if (videoFrame) videoFrame.src = '';
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeVideo();
        });
    }

    // Handle contact form submission
    const miniContactForm = document.getElementById('contact-form-mini');
    if (miniContactForm) {
        miniContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending...';

            const formData = new FormData(this);
            
            fetch('send_email.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (window.console) console.log('Communication Bridge Response:', response.status, response.statusText);
                if (response.ok) {
                    return response.text();
                }
                throw new Error(`Infrastructure bridge failed (Status: ${response.status})`);
            })
            .then(data => {
                alert('Bridge successful: Your inquiry has been sent to Kyeremahaaron@gmail.com');
                this.reset();
            })
            .catch(error => {
                if (window.console) console.error('SkyBridge Communication Failure Details:', error.message);
                alert('Error: Communication bridge failed. Press F12 to check the console for infrastructure details.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            });
        });
    }

    const storageKey = 'skybridge-admin-projects';
    const projectsApiUrl = 'api/projects.php';
    let adminProjectsCache = [];

    function getLocalProjects() {
        try {
            const raw = localStorage.getItem(storageKey);
            return raw ? JSON.parse(raw) : [];
        } catch (error) {
            if (window.console) console.error('Unable to read local admin projects:', error);
            return [];
        }
    }

    function saveLocalProjects(projects) {
        localStorage.setItem(storageKey, JSON.stringify(projects));
    }

    async function loadAdminProjects() {
        try {
            const response = await fetch(`${projectsApiUrl}?t=${Date.now()}`);
            if (!response.ok) {
                throw new Error(`Projects API GET failed with status ${response.status}`);
            }

            const payload = await response.json();
            adminProjectsCache = Array.isArray(payload.projects) ? payload.projects : [];
            saveLocalProjects(adminProjectsCache);
            return true;
        } catch (error) {
            if (window.console) console.warn('Falling back to local projects cache:', error.message);
            adminProjectsCache = getLocalProjects();
            return false;
        }
    }

    async function createAdminProject(projectPayload) {
        const response = await fetch(projectsApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectPayload)
        });

        if (!response.ok) {
            throw new Error(`Projects API POST failed with status ${response.status}`);
        }

        const payload = await response.json();
        if (!payload || !payload.project) {
            throw new Error('Projects API did not return a project payload.');
        }

        return payload.project;
    }

    async function deleteAdminProject(projectId) {
        const response = await fetch(`${projectsApiUrl}?id=${encodeURIComponent(projectId)}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Projects API DELETE failed with status ${response.status}`);
        }
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, (char) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char]));
    }

    function createProjectCard(project) {
        const article = document.createElement('article');
        article.className = 'project-card';
        article.dataset.adminProjectId = project.id;

        const actionState = project.status === 'live' ? 'live' : 'pending';
        const safeLink = project.link ? escapeHtml(project.link) : '#';

        article.innerHTML = `
            <div class="project-mockup" aria-hidden="true">
                <div class="project-window project-window-image">
                    <img src="${project.image}" alt="${escapeHtml(project.name)} preview">
                </div>
            </div>
            <div class="project-content">
                <span class="project-category">${escapeHtml(project.category)}</span>
                <h3 class="project-name">${escapeHtml(project.name)}</h3>
                <p class="project-description">${escapeHtml(project.description)}</p>
                <a href="${safeLink}" class="btn btn-primary" data-project-state="${actionState}">View Project</a>
            </div>
        `;

        return article;
    }

    function renderAdminProjects() {
        const projectsList = document.getElementById('admin-projects-list');
        const emptyState = document.getElementById('admin-projects-empty');
        if (!projectsList || !emptyState) return;

        const projects = adminProjectsCache;
        projectsList.innerHTML = '';

        if (!projects.length) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        projects.forEach((project) => {
            const item = document.createElement('div');
            item.className = 'admin-project-item';
            item.innerHTML = `
                <div>
                    <h4>${escapeHtml(project.name)}</h4>
                    <p>${escapeHtml(project.category)} • ${project.status === 'live' ? 'Live Project' : 'Not Yet Hosted'}</p>
                </div>
                <div class="admin-project-actions">
                    <button type="button" class="btn btn-outline" data-delete-project="${project.id}">Delete</button>
                </div>
            `;
            projectsList.appendChild(item);
        });
    }

    function renderPortfolioProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        const emptyState = document.getElementById('projects-empty-state');
        if (!projectsGrid) return;

        projectsGrid.querySelectorAll('[data-admin-project-id]').forEach((node) => node.remove());
        const projects = adminProjectsCache;

        projects.forEach((project) => {
            projectsGrid.appendChild(createProjectCard(project));
        });

        if (emptyState) {
            emptyState.style.display = projects.length ? 'none' : 'block';
        }
    }

    function readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Unable to read image file.'));
            reader.readAsDataURL(file);
        });
    }

    function initAdminProjectForm() {
        const form = document.getElementById('admin-project-form');
        const projectsList = document.getElementById('admin-projects-list');
        if (!form) return;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const name = document.getElementById('project-name').value.trim();
            const category = document.getElementById('project-category').value.trim();
            const description = document.getElementById('project-description').value.trim();
            const link = document.getElementById('project-link').value.trim();
            const status = document.getElementById('project-status').value;
            const imageInput = document.getElementById('project-image');
            const imageFile = imageInput && imageInput.files ? imageInput.files[0] : null;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            if (!imageFile) {
                alert('Select a project image before uploading.');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Uploading...';

            try {
                const image = await readFileAsDataUrl(imageFile);
                const createdProject = await createAdminProject({
                    name,
                    category,
                    description,
                    link,
                    status,
                    image
                });
                adminProjectsCache.push(createdProject);
                saveLocalProjects(adminProjectsCache);
                form.reset();
                renderAdminProjects();
                renderPortfolioProjects();
                alert('Project uploaded. Open the portfolio page to see it.');
            } catch (error) {
                if (window.console) console.error('Project upload failed:', error.message);
                alert('Project upload failed. Check that the backend API is available and try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });

        if (projectsList) {
            projectsList.addEventListener('click', (event) => {
                const trigger = event.target.closest('[data-delete-project]');
                if (!trigger) return;

                const projectId = trigger.getAttribute('data-delete-project');
                deleteAdminProject(projectId)
                    .then(() => {
                        adminProjectsCache = adminProjectsCache.filter((project) => project.id !== projectId);
                        saveLocalProjects(adminProjectsCache);
                        renderAdminProjects();
                        renderPortfolioProjects();
                    })
                    .catch((error) => {
                        if (window.console) console.error('Project deletion failed:', error.message);
                        alert('Unable to delete project from backend. Check API availability and try again.');
                    });
            });
        }
    }

    function initProjectLinks() {
        document.addEventListener('click', (event) => {
            const projectLink = event.target.closest('[data-project-state]');
            if (!projectLink) return;

            const state = projectLink.getAttribute('data-project-state');
            if (projectLink.dataset.loading === 'true') {
                event.preventDefault();
                return;
            }

            if (state === 'pending') {
                event.preventDefault();
                const originalText = projectLink.textContent;
                projectLink.dataset.loading = 'true';
                projectLink.textContent = 'Not yet hosted try other projects';
                projectLink.setAttribute('aria-disabled', 'true');

                window.setTimeout(() => {
                    projectLink.textContent = originalText;
                    projectLink.dataset.loading = 'false';
                    projectLink.removeAttribute('aria-disabled');
                }, 2200);
                return;
            }

            if (state === 'live') {
                event.preventDefault();
                projectLink.dataset.loading = 'true';
                projectLink.textContent = 'Please wait......';
                projectLink.setAttribute('aria-disabled', 'true');

                window.setTimeout(() => {
                    window.location.href = projectLink.href;
                }, 1200);
            }
        });
    }

    initAdminProjectForm();
    loadAdminProjects().finally(() => {
        renderAdminProjects();
        renderPortfolioProjects();
    });
    initProjectLinks();

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
});
