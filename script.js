function updateCountdown() {
    const weddingDate = new Date('2026-08-28T17:00:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = ('0' + hours).slice(-2);
    document.getElementById('minutes').textContent = ('0' + minutes).slice(-2);
    document.getElementById('seconds').textContent = ('0' + seconds).slice(-2);

    if (distance < 0) {
        clearInterval(countdownInterval);
    }
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

new Vue({
    el: '#guests',
    data: {
        participants: {
            name: '',
            invited_adults: 2,
            confirmed_adults: null,
            invited_children: 2,
            confirmed_children: 0,
            status: 0
        },
        isSubmitting: false
    },
    computed: {
        statusMessage() {
            if (this.participants.status === 1) {
                return 'Mulțumim pentru confirmare! Ne bucurăm enorm că veți fi alături de noi!';
            } else if (this.participants.status === 3) {
                return 'Îți mulțumim pentru răspuns. Ne pare rău că nu poți veni, dar te așteptăm cu drag altă dată!';
            }
            return 'Te rugăm să confirmi prezența mai jos';
        },
        confirmButton() {
            const adults = parseInt(this.participants.confirmed_adults);
            const children = parseInt(this.participants.confirmed_children);
            const total = adults + children;

            if (adults === 0) {
                return 'Îmi pare rău, nu pot participa';
            } else if (total === 1) {
                return 'Confirm participarea – vin singur(ă)';
            } else {
                let text = `Confirm participarea – venim ${total} ${total === 1 ? 'persoană' : 'persoane'}`;
                if (adults > 0 && children > 0) {
                    text += `: ${adults} ${adults === 1 ? 'adult' : 'adulți'} și ${children} ${children === 1 ? 'copil' : 'copii'}`;
                }
                return text;
            }
        }
    },
    created() {
        if (window.location.search.includes('reset=form')) {
            this.participants.name = '';
            this.participants.confirmed_adults = null;
            this.participants.confirmed_children = 0;
            this.participants.status = 0;

            history.replaceState({}, '', window.location.pathname);
        }
    },
    methods: {
        range(start, end) {
            return Array(end - start + 1).fill().map((_, i) => start + i);
        },
        async submitForm() {
            if (this.isSubmitting) return;
            this.isSubmitting = true;


            const GOOGLE_FORM_ID = '1FAIpQLSehgUEtoII3xsbxF4Yh3uFhZ366JtdAj7vk956V1a_Jp2AtSg';


            const entryName = 'entry.1300013391';
            const entryAdults = 'entry.1064676961';
            const entryChildren = 'entry.1624978708';

            const formData = new FormData();
            formData.append(entryName, this.participants.name.trim());
            formData.append(entryAdults, this.participants.confirmed_adults);
            formData.append(entryChildren, this.participants.confirmed_children);

            try {
                await fetch(`https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                });

                const attending = (this.participants.confirmed_adults == 0) ? 'no' : 'yes';
                const nameEncoded = encodeURIComponent(this.participants.name.trim());
                window.location.href = `multumesc.html?name=${nameEncoded}&attending=${attending}`;

            } catch (error) {
                alert('A apărut o problemă la trimitere. Te rugăm să încerci din nou sau să ne scrii direct.');
                this.isSubmitting = false;
            }
        }
    }
});

// const autoRevealElements = document.querySelectorAll(`
//     .hero-section,
//     .cover-section,
//     .timeline-section,
//     .timeline-item,
//     .countdown-section,
//     .moodboard-section,
//     .mood-circle,
//     .details-section,
//     .detail-item,
//     .rsvp-section,
//     footer
// `);

// const revealOnScroll = () => {
//     const trigger = window.innerHeight * 0.85;

//     autoRevealElements.forEach(el => {
//         const top = el.getBoundingClientRect().top;
//         if (top < trigger) {
//             el.classList.add('revealed');
//         }
//     });
// };

// window.addEventListener('scroll', revealOnScroll);
// window.addEventListener('load', revealOnScroll);
