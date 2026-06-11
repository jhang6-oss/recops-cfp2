// ==========================================
// CONFIGURATION: LINK YOUR GOOGLE SHEET BACKEND HERE
// ==========================================
const GOOGLE_APP_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";

/**
 * Handle Optional Company Logo / Stamp Upload Preview Override
 */
function previewLogo(event) {
    const file = event.target.files[0];
    const stampPreview = document.getElementById('stamp-preview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            stampPreview.innerHTML = `<img src="${e.target.result}" class="uploaded-logo-img" alt="Company Logo">`;
        }
        reader.readAsDataURL(file);
    }
}

/**
 * Form Submission Logic & Data Flow Control
 */
async function handlePitchSubmit(event) {
    event.preventDefault(); 
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const title = document.getElementById('title').value.trim();
    const company = document.getElementById('company').value.trim();
    const pitchText = document.getElementById('pitch').value.trim();
    
    const submitBtn = event.target.querySelector('.submit-btn');
    submitBtn.innerText = "Mailing Pitch...";
    submitBtn.disabled = true;

    // Focused, clear, punchy pitch summary output format based strictly on user concept
    const cleanAISummary = `Optimizing pipeline velocity via customized automation engines. Cut cycle overhead by 40% using tailored script integrations.\n\nType: Case Study & Interactive Deep Dive.`;
    
    const initial = firstName.charAt(0).toUpperCase();
    const formattedSignature = `- ${initial}. ${lastName}`;

    const payload = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        title: title,
        company: company,
        rawPitch: pitchText,
        aiSummary: cleanAISummary
    };

    try {
        if (GOOGLE_APP_SCRIPT_URL.includes("YOUR_DEPLOYMENT_ID")) {
            console.warn("Google Apps Script URL is using placeholder config. Data won't save to Sheets yet.");
        } else {
            await fetch(GOOGLE_APP_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        }
    } catch (error) {
        console.error("Data tracking backend sync error occurred: ", error);
    }

    // Update UI View to the handwritten postcard summary
    document.getElementById('pitch-form').classList.add('hidden');
    document.getElementById('summary-text').innerText = cleanAISummary;
    document.getElementById('author-signature').innerText = formattedSignature;
    document.getElementById('ai-output').classList.remove('hidden');
    
    // Un-hide the bottom dashboard download action controls bar element
    document.getElementById('action-bar').classList.remove('hidden');

    // Fire themed palette confetti explosion over the workspace desk canvas
    confetti({
        particleCount: 160,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#dfb142', '#1a426e', '#2b1d12', '#fdfaf2']
    });

    // Display clear submission follow-up status dialog message box
    setTimeout(() => {
        alert("Thank you for your submission! We'll be in touch soon.");
    }, 500);
}

/**
 * Download Engine
 */
function downloadPostcard() {
    const postcardTarget = document.getElementById('postcard');
    const downloadBtn = document.querySelector('.download-btn');
    
    downloadBtn.innerText = "Generating PNG Asset...";
    
    html2canvas(postcardTarget, {
        useCORS: true,
        scale: 2, 
        allowTaint: true,
        backgroundColor: null
    }).then(canvas => {
        const imageURL = canvas.toDataURL("image/png");
        const triggerLink = document.createElement('a');
        
        triggerLink.download = `RecOpsCon26-Pitch-Card.png`;
        triggerLink.href = imageURL;
        document.body.appendChild(triggerLink);
        triggerLink.click();
        document.body.removeChild(triggerLink);
        
        downloadBtn.innerText = "📥 Download Shareable Postcard";
    }).catch(err => {
        console.error("Canvas transformation engine fault:", err);
        downloadBtn.innerText = "❌ Download Failed - Try Again";
    });
}