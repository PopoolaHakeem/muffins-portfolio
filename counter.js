document.addEventListener("DOMContentLoaded", function () {
  const counters = document.querySelectorAll(".counter");

  const startCounter = (counter) => {
    const target = Number(counter.getAttribute("data-target"));
    let count = 0;
    const speed = 30;

    function updateCount() {
      if (count < target) {
        count++;
        counter.innerText = count;
        setTimeout(updateCount, speed);
      } else {
        counter.innerText = target;
      }
    }

    updateCount();
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        startCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  counters.forEach((counter) => {
    observer.observe(counter);
  });
});