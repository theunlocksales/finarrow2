// ============================================
// FINARROW - COMPLETE JAVASCRIPT
// All Functionality Included
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ===== Mobile Navigation =====
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.getElementById('navbar');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // ===== Navbar Scroll Effect =====
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===== Counter Animation =====
    const counters = document.querySelectorAll('.counter');
    if (counters.length) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-target') || '0', 10);
                    animateCounter(el, target);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    function animateCounter(element, target) {
        let current = 0;
        const duration = 2000;
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            current = Math.floor(target * eased);
            element.textContent = current.toLocaleString('en-IN');
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // ===== AOS Init =====
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 900,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
        });
    }

    // ===== Smooth Scroll =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 90;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ===== EMI Calculator =====
    if (document.getElementById('loanAmount')) {
        const loanAmountInput = document.getElementById('loanAmount');
        const loanAmountRange = document.getElementById('loanAmountRange');
        const interestRateInput = document.getElementById('interestRate');
        const interestRateRange = document.getElementById('interestRateRange');
        const loanTenureInput = document.getElementById('loanTenure');
        const loanTenureRange = document.getElementById('loanTenureRange');

        const emiAmountEl = document.getElementById('emiAmount');
        const principalAmountEl = document.getElementById('principalAmount');
        const totalInterestEl = document.getElementById('totalInterest');
        const totalAmountEl = document.getElementById('totalAmount');

        // Sync inputs with ranges
        loanAmountInput.addEventListener('input', e => {
            loanAmountRange.value = e.target.value;
            calculateEMI();
        });

        loanAmountRange.addEventListener('input', e => {
            loanAmountInput.value = e.target.value;
            calculateEMI();
        });

        interestRateInput.addEventListener('input', e => {
            interestRateRange.value = e.target.value;
            calculateEMI();
        });

        interestRateRange.addEventListener('input', e => {
            interestRateInput.value = e.target.value;
            calculateEMI();
        });

        loanTenureInput.addEventListener('input', e => {
            loanTenureRange.value = e.target.value;
            calculateEMI();
        });

        loanTenureRange.addEventListener('input', e => {
            loanTenureInput.value = e.target.value;
            calculateEMI();
        });

        // EMI Calculation
        function calculateEMI() {
            const P = parseFloat(loanAmountInput.value) || 1000000;
            const R = (parseFloat(interestRateInput.value) || 10.5) / 12 / 100;
            const N = (parseFloat(loanTenureInput.value) || 5) * 12;

            const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
            const totalPayment = emi * N;
            const totalInterest = totalPayment - P;

            emiAmountEl.textContent = `₹${Math.round(emi).toLocaleString('en-IN')}`;
            principalAmountEl.textContent = `₹${P.toLocaleString('en-IN')}`;
            totalInterestEl.textContent = `₹${Math.round(totalInterest).toLocaleString('en-IN')}`;
            totalAmountEl.textContent = `₹${Math.round(totalPayment).toLocaleString('en-IN')}`;

            updateChart(P, totalInterest);
        }

        // Chart.js
        let emiChart = null;
        const ctx = document.getElementById('emiChart');

        if (ctx && typeof Chart !== 'undefined') {
            function updateChart(principal, interest) {
                const chartData = {
                    labels: ['Principal Amount', 'Total Interest'],
                    datasets: [{
                        data: [principal, interest],
                        backgroundColor: ['#0A1628', '#F5A623'],
                        borderWidth: 0
                    }]
                };

                if (emiChart) {
                    emiChart.data = chartData;
                    emiChart.update();
                } else {
                    emiChart = new Chart(ctx, {
                        type: 'doughnut',
                        data: chartData,
                        options: {
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        padding: 15,
                                        font: { size: 12, family: 'Inter' }
                                    }
                                }
                            },
                            cutout: '65%'
                        }
                    });
                }
            }
        }

        // Initial calculation
        calculateEMI();
    }

    // ===== Pincode Search =====
    const pincodeInput = document.getElementById('pincodeInput');
    const searchPincode = document.getElementById('searchPincode');
    const pincodeResults = document.getElementById('pincodeResults');
    const lendersGrid = document.getElementById('lendersGrid');

    if (searchPincode && pincodeInput) {
        searchPincode.addEventListener('click', () => {
            const pincode = pincodeInput.value.trim();

            if (pincode.length !== 6 || !/^[0-9]{6}$/.test(pincode)) {
                showToast('Please enter a valid 6-digit pincode', 'error');
                return;
            }

            // Simulated lender data
            const lenders = [
                { name: 'HDFC Bank', rate: '8.5%' },
                { name: 'ICICI Bank', rate: '8.7%' },
                { name: 'SBI', rate: '8.6%' },
                { name: 'Axis Bank', rate: '8.9%' },
                { name: 'Kotak Mahindra', rate: '9.0%' },
                { name: 'Bajaj Finserv', rate: '9.5%' }
            ];

            lendersGrid.innerHTML = '';
            lenders.forEach(lender => {
                const lenderDiv = document.createElement('div');
                lenderDiv.className = 'lender-item';
                lenderDiv.innerHTML = `
                    <strong>${lender.name}</strong>
                    <span>From ${lender.rate} p.a.</span>
                `;
                lendersGrid.appendChild(lenderDiv);
            });

            pincodeResults.style.display = 'block';
            pincodeResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            showToast('Lenders found in your area!', 'success');
        });

        pincodeInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                searchPincode.click();
            }
        });
    }

    // ===== Business Loan Form =====
    const businessLoanForm = document.getElementById('businessLoanForm');
    if (businessLoanForm) {
        businessLoanForm.addEventListener('submit', e => {
            e.preventDefault();

            const formData = new FormData(businessLoanForm);
            const data = Object.fromEntries(formData.entries());

            if (!data.name || !data.phone || !data.loanAmount) {
                showToast('Please fill all required fields', 'error');
                return;
            }

            const phoneClean = data.phone.replace(/[^0-9]/g, '');
            if (phoneClean.length !== 10) {
                showToast('Enter a valid 10-digit mobile number', 'error');
                return;
            }

            // WhatsApp message
            const msg = 
                `Hi Finarrow!%0A%0A` +
                `I'm interested in a Business Loan:%0A%0A` +
                `Name: ${data.name}%0A` +
                `Phone: ${data.phone}%0A` +
                `Email: ${data.email || 'Not provided'}%0A` +
                `Loan Amount: ${data.loanAmount}%0A` +
                `Message: ${data.message || 'No additional message'}`;

            const waUrl = `https://wa.me/917838393421?text=${msg}`;

            showToast('Redirecting to WhatsApp...', 'success');
            setTimeout(() => {
                window.open(waUrl, '_blank');
                businessLoanForm.reset();
            }, 800);
        });
    }

    // ===== Toast Notifications =====
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `finarrow-toast finarrow-toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">
                ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : 
                  type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' : 
                  '<i class="fas fa-info-circle"></i>'}
            </span>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 50);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ===== Back to Top Button =====
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== Hero Video Autoplay =====
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.play().catch(() => {
            // Autoplay blocked - silent fail
        });
    }

    console.log('%c🚀 Finarrow Website Loaded!', 'color:#F5A623;font-weight:bold;font-size:16px;');
});

// ===== Extra Styles (Toast & Back to Top) =====
const extraStyle = document.createElement('style');
extraStyle.textContent = `
.finarrow-toast {
    position: fixed;
    top: 96px;
    right: 24px;
    background: #ffffff;
    border-radius: 12px;
    padding: 12px 18px;
    box-shadow: 0 12px 32px rgba(0,0,0,0.12);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 1100;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.25s ease;
    font-size: 14px;
}

.finarrow-toast.show {
    opacity: 1;
    transform: translateY(0);
}

.finarrow-toast-success .toast-icon { color: #16A34A; }
.finarrow-toast-error .toast-icon { color: #DC2626; }
.finarrow-toast-info .toast-icon { color: #2563EB; }

.back-to-top {
    position: fixed;
    bottom: 32px;
    left: 24px;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg,#F5A623,#FF8C42);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
    box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: all 0.25s ease;
    z-index: 1050;
}

.back-to-top.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.back-to-top:hover {
    transform: translateY(-3px);
}
`;
document.head.appendChild(extraStyle);
