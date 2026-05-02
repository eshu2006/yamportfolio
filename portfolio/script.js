const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');
const revealElements = document.querySelectorAll('.reveal');
const header = document.querySelector('nav');
const contactForm = document.getElementById('contact-form');
const sendButton = document.getElementById('send-button');
const formStatus = document.getElementById('form-status');

// Replace these values with your actual EmailJS credentials:
const EMAILJS_SERVICE_ID = 'service_n7i6tmd';
const EMAILJS_TEMPLATE_ID = 'template_r9n2eop';
const EMAILJS_PUBLIC_KEY = 'ANsY7Vm80W56rI0TD';

emailjs.init(EMAILJS_PUBLIC_KEY);

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

navItems.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    header.style.background = 'rgba(8, 18, 38, 0.94)';
    header.style.boxShadow = '0 18px 42px rgba(0,0,0,0.28)';
  } else {
    header.style.background = 'rgba(8, 18, 38, 0.68)';
    header.style.boxShadow = 'none';
  }
  revealOnScroll();
});

const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.88;
  revealElements.forEach(elem => {
    const elementTop = elem.getBoundingClientRect().top;
    if (elementTop < triggerBottom) {
      elem.classList.add('show');
    }
  });
};

const validateEmail = email => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const setStatus = (message, isError = false) => {
  formStatus.textContent = message;
  formStatus.classList.toggle('error-text', isError);
};

const setLoading = isLoading => {
  if (isLoading) {
    sendButton.classList.add('loading');
    sendButton.disabled = true;
    sendButton.textContent = 'Sending...';
  } else {
    sendButton.classList.remove('loading');
    sendButton.disabled = false;
    sendButton.textContent = 'Send Message';
  }
};

contactForm.addEventListener('submit', event => {
  event.preventDefault();
  setStatus('');

  const name = contactForm.from_name.value.trim();
  const email = contactForm.from_email.value.trim();
  const subject = contactForm.subject.value.trim();
  const message = contactForm.message.value.trim();

  if (!name || !email || !subject || !message) {
    setStatus('Please complete all fields before sending.', true);
    return;
  }

  if (!validateEmail(email)) {
    setStatus('Please enter a valid email address.', true);
    return;
  }

  setLoading(true);

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    from_name: name,
    from_email: email,
    reply_to: email,
    subject: subject,
    message: message,
  })
    .then(() => {
      setStatus('Message sent successfully! I will get back to you soon.');
      contactForm.reset();
      setLoading(false);
    })
    .catch(error => {
      console.error('EmailJS error:', error);
      const errorText = error && error.text ? error.text : '';
      if (errorText.includes('Invalid grant')) {
        setStatus('EmailJS failed: reconnect your Gmail service in EmailJS dashboard.', true);
      } else {
        setStatus('Failed to send message. Please try again later.', true);
      }
      setLoading(false);
    });
});

revealOnScroll();
