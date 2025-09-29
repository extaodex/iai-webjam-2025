document.addEventListener("DOMContentLoaded", function() {
    // --- General purpose Intersection Observer for animations ---
    const animatedElements = document.querySelectorAll(".special-section, .culture-card, .stat-card, .dashboard-card, .gallery-item");
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

    // --- Flipping Cards ---
    const cultureCards = document.querySelectorAll(".culture-card");
    cultureCards.forEach(card => {
        card.addEventListener("click", function() {
            card.classList.toggle("is-flipped");
        });
    });

    // --- Number Counter Animation ---
    const numberCounters = document.querySelectorAll('.stat-number[data-target]');
    const numberObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                
                let current = 0;
                const increment = Math.max(1, Math.ceil(target / 100));

                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        if (current > target) {
                            current = target;
                        }
                        counter.innerText = current.toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target.toLocaleString();
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.8 });

    numberCounters.forEach(counter => {
        numberObserver.observe(counter);
    });

    // --- Infinite Gallery Scroll ---
    const gallery = document.querySelector('.image-gallery-grid');
    if (gallery && gallery.children.length > 0) {
        if (!gallery.hasAttribute('data-duplicated')) {
            const galleryItems = gallery.innerHTML;
            gallery.innerHTML += galleryItems;
            gallery.setAttribute('data-duplicated', 'true');
        }
        gallery.classList.add('is-scrolling');
    }

    // --- Quiz Logic with Retry Button ---
    const quizzes = {
        "quiz-afrique": { q1: "sahara", q2: "djembe", q3: "nigeria" },
        "quiz-europe": { q1: "italie", q2: "mozart", q3: "andalousie" },
        "quiz-asie": { q1: "chanoyu", q2: "chine", q3: "inde" },
        "quiz-ameriques": { q1: "cuba", q2: "jazz", q3: "samba" },
        "quiz-oceanie": { q1: "maori", q2: "didgeridoo", q3: "australie" }
    };

    const quizForms = document.querySelectorAll("form[id^='quiz-']");
    quizForms.forEach(quizForm => {
        const submitButton = quizForm.querySelector('button[type="submit"]');
        const resultsContainer = quizForm.nextElementSibling;

        quizForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const quizId = this.id;
            let score = 0;
            const totalQuestions = Object.keys(quizzes[quizId]).length;

            this.querySelectorAll('input[type="radio"]').forEach(input => input.disabled = true);
            if(submitButton) submitButton.style.display = 'none';

            for (const [question, correctAnswer] of Object.entries(quizzes[quizId])) {
                const selectedAnswer = this.elements[question].value;
                const questionLabels = this.querySelectorAll(`input[name="${question}"]`);

                questionLabels.forEach(labelInput => {
                    const parentLabel = labelInput.parentElement;
                    parentLabel.classList.remove("correct", "incorrect");
                    if (labelInput.value === correctAnswer) {
                        parentLabel.classList.add("correct");
                    }
                    if (labelInput.checked && labelInput.value !== correctAnswer) {
                        parentLabel.classList.add("incorrect");
                    }
                });

                if (selectedAnswer === correctAnswer) {
                    score++;
                }
            }

            if (resultsContainer) {
                resultsContainer.innerHTML = `<h4>Votre score :</h4><p>${score} / ${totalQuestions}</p><button class="quiz-retry-btn">Réessayer</button>`;
                resultsContainer.style.display = "block";

                const retryButton = resultsContainer.querySelector('.quiz-retry-btn');
                if (retryButton) {
                    retryButton.addEventListener('click', () => {
                        resultsContainer.style.display = 'none';
                        quizForm.reset();
                        
                        this.querySelectorAll('input[type="radio"]').forEach(input => input.disabled = false);
                        if(submitButton) submitButton.style.display = 'block';

                        const labels = quizForm.querySelectorAll('label');
                        labels.forEach(label => {
                            label.classList.remove('correct', 'incorrect');
                        });
                    });
                }
            }
        });
    });
});
