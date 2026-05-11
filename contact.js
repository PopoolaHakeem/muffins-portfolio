// CONTACT FORM EMAIL AUTHENTICATION > emailjs
emailjs.init("qAVR_7BFRjIL4pT7s");

const form = document.getElementById("contact-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // EMAILJS SERVICE ID, TEMPLATE ID, AND USER ID
  emailjs.send("service_v14g2ki", "template_k353rb6", {
    from_name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    from_email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value
  })

  // HANDLE SUCCESS AND ERROR RESPONSES
  .then(() => {
    alert("Message sent successfully!");
    form.reset();
  })
  // 
  .catch((error) => {
    alert("Failed to send message");
    console.log(error);
  });
});