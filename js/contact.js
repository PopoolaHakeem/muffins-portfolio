// ========================================
// CONTACT FORM — EMAILJS
// The EmailJS public key is intended for browser use.
// Configure allowed domains and rate limits in your EmailJS dashboard.
// ========================================

const contactForm = document.getElementById("contact-form");
const emailJs = window.emailjs;

if (contactForm && emailJs) {
  emailJs.init("qAVR_7BFRjIL4pT7s");

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const getValue = (id) => document.getElementById(id)?.value?.trim() ?? "";
    

    try {
      await emailJs.send("service_v14g2ki", "template_k353rb6", {
        from_name: getValue("name"),
        phone: getValue("phone"),
        from_email: getValue("email"),
        subject: getValue("subject"),
        message: getValue("message"),
      });

      alert("Message sent successfully!");
      contactForm.reset();
    } catch (error) {
      console.error("EmailJS submission failed:", error);
      alert("Your message could not be sent. Please try again later.");
    }
  });
}



