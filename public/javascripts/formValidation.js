export class FormValidation {
  constructor(form) {
    this.form = form;
    this.errorMessages = {
      full_name: "Name is required and should only contain letters.",
      email: "Enter a valid email address.",
      phone_number: "Phone number is required and should have exactly 10 digits.",
    };
  }

  validateField(field) {
    let isValid = true;
    const errorElement = field.previousElementSibling;

    switch (field.name) {
      case "full_name":
        isValid = /^[a-zA-Z\s]+$/.test(field.value.trim());
        break;
      case "email":
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        break;
      case "phone_number":
        isValid = /^\d{10}$/.test(field.value.trim());
        break;
      default:
        isValid = field.value.trim() !== "";
    }

    if (!isValid) {
      errorElement.textContent = this.errorMessages[field.name] || "Invalid input.";
      errorElement.classList.add("visible");
    } else {
      errorElement.textContent = "";
      errorElement.classList.remove("visible");
    }

    return isValid;
  }

  validateForm() {
    this.resetErrors();
    const fields = Array.from(this.form.elements).filter(element  => {
      return element.type !== 'submit' && element.type !== 'button' && element.name !== 'tags';
    });
    return fields.every((field) => this.validateField(field));
  }

  resetErrors() {
    const errorElements = this.form.querySelectorAll(".form-error");
    errorElements.forEach((error) => {
      error.textContent = "";
      error.classList.remove("visible");
    });
  }
}