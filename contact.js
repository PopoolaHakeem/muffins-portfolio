emailjs.init("qAVR_7BFRjIL4pT7s");

const form = document.getElementById("contact-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  emailjs.send("service_v14g2ki", "template_k353rb6", {
    from_name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    from_email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value
  })
  .then(() => {
    alert("Message sent successfully!");
    form.reset();
  })
  .catch((error) => {
    alert("Failed to send message");
    console.log(error);
  });
});