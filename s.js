
const ssvElement = document.getElementById("finalrow");
const materialElement = document.getElementById("metals");
const paraElement = document.getElementById("contents");
const manpowerElement = document.getElementById("power");
const machineElement = document.getElementById("machine");
const loansElement = document.getElementById("loans");
const offersElement = document.getElementById("offers");
const estimatorElement = document.getElementById("estimator");
const tipsElement = document.getElementById("tips");
const simulatorElement = document.getElementById("simulator");
const planElement = document.getElementById("plans");
paraElement.textContent="Welcome to SSV Constructions"
ssvElement.addEventListener('mouseover',()=>{
    paraElement.textContent="Welcome to SSV Constructions! One point solution for your Dream home!!"
});


materialElement.addEventListener('mouseover',()=>{
    paraElement.textContent="Avail 5 - 20 % Discount on Building Materials! BOOK NOW"
});

manpowerElement.addEventListener('mouseover',()=>{
    paraElement.textContent="Do you need Construction Professionals ? Contact listed Professionals."
})


machineElement.addEventListener('mouseover',()=>{
    paraElement.textContent="Contact us for Machinary & seamless Construction."
})


loansElement.addEventListener('mouseover',()=>{
    paraElement.textContent="Avail best Home loan Offers with low interest rates. Apply now! "
})

offersElement.addEventListener('mouseover',()=>{
    paraElement.textContent="Avail Credit card Discounts on purchase of Building Materials."
})

planElement.addEventListener('mouseover',()=>{
    paraElement.textContent="Explore Building plans, Elevations and 3D Models with No Charges."
})

estimatorElement.addEventListener('mouseover',()=>{
    paraElement.textContent="Get Free Estimate for your House Construction."
})

tipsElement.addEventListener('mouseover',()=>{
    paraElement.textContent="Get Vaastu, Efficient, Economical & Long Lasting Construction tips."
})


simulatorElement.addEventListener('mouseover',()=>{
    paraElement.textContent="Design your Dream Home with our Simulator."
})







function generatePromoCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 6;
    let promoCode = '';
    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        promoCode += characters[randomIndex];
    }
    document.getElementById('promoCode').textContent = promoCode;
    updateShareLinks(promoCode);
    updateIconLinks(promoCode);
}

function updateShareLinks(promoCode) {
    const message = `Signup in SSV Construction website for Building Materials with Discount & use my promo code ${promoCode} to earn rewards!`;
    const url = 'https://ssvconstructions.in/';
    
    document.getElementById('whatsapp').href = `https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`;
    document.getElementById('linkedin').href = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(message)}`;
    document.getElementById('twitter').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`;
    document.getElementById('facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`;
    document.getElementById('instagram').href = `https://www.instagram.com/?text=${encodeURIComponent(message + ' ' + url)}`;
}

function sharePromoCode() {
    const promoCode = document.getElementById('promoCode').textContent;
    if (navigator.share) {
        navigator.share({
            title: 'Refer and Earn',
            text: `Join me on Inshorts and use my promo code ${promoCode} to earn rewards!`,
            url: 'https://ssvconstructions.in/',
        })
        .then(() => console.log('Promo code shared successfully!'))
        .catch((error) => console.error('Error sharing promo code:', error));
    } else {
        alert('Sharing is not supported on this browser. Use the social media icons instead.');
    }
}

function copyToClipboard() {
    const promoCode = document.getElementById('promoCode').textContent;
    navigator.clipboard.writeText(promoCode).then(() => {
        alert('Promo code copied to clipboard!');
    }).catch((error) => {
        console.error('Failed to copy promo code:', error);
    });
}
function updateIconLinks(promoCode) {
    const message = `Join me on Inshorts and use my promo code ${promoCode} to earn rewards!`;
    const url1 = 'https://ssvconstructions.in/';
    const url = 'https://ssvconstructions.in/';
    
    document.getElementById('whatsapp-share').href = `https://ssvconstructions.in/?text=${encodeURIComponent(message + ' ' + url1)}`;
    document.getElementById('linkedin-share').href = `https://ssvconstructions.in/materials-mart/?url=${encodeURIComponent(url)}`;
    document.getElementById('twitter-share').href = `https://ssvconstructions.in/professionals/?url=${encodeURIComponent(url1)}`;
    document.getElementById('facebook-share').href = `https://ssvconstructions.in/construction-machinery/?url=${encodeURIComponent(url)}`;
    document.getElementById('instagram-share').href = `https://ssvconstructions.in/loans/?url=${encodeURIComponent(url)}`;
    document.getElementById('instagram-share2').href = `https://ssvconstructions.in/maintenance-page/?url=${encodeURIComponent( url1)}`;
    document.getElementById('instagram-share3').href = `https://ssvconstructions.in/maintenance-page/?url=${encodeURIComponent(url)}`;
    document.getElementById('instagram-share4').href = `https://ssvconstructions.in/maintenance-page/?url=${encodeURIComponent(url1)}`;
    document.getElementById('instagram-share5').href = `https://ssvconstructions.in/construction-tips/?url=${encodeURIComponent(url)}`;
    document.getElementById('instagram-share6').href = `https://ssvconstructions.in/construction-guide/?url=${encodeURIComponent( url)}`;
}


document.addEventListener("DOMContentLoaded", () => {
    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach((question) => {
        question.addEventListener("click", () => {
            const answer = question.nextElementSibling;
            const isActive = answer.style.display === "block";

            // Close all answers
            document.querySelectorAll(".faq-answer").forEach((ans) => (ans.style.display = "none"));

            // Toggle the clicked answer
            if (!isActive) {
                answer.style.display = "block";
            }
        });
    });
});



document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function () {
        const key = this.dataset.key;
        const answer = document.getElementById(`answer-${key}`);
        
        if (answer) {
            answer.classList.toggle('visible');
        }
    });
});
// Generate promo code on page load
window.onload = generatePromoCode;
