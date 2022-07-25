const multiStepForm = document.querySelector("[data-multi-step]");
const formSteps = [...multiStepForm.querySelectorAll("[data-step]")];
let currentStep = formSteps.findIndex(step => {
    return step.classList.contains("active")
});

console.log(currentStep);

if (currentStep) {
    currentStep = 0;
    formSteps[currentStep].classList.add("active");
};

multiStepForm.addEventListener("click", e => {
    if (e.target.matches("[data-next")) {
        incrementor = 1
    } else if (e.target.matches("[data-back]")) {
        incrementor = -1
    } else {
        return;
    };
    
    if (incrementor == null) return;
    const inputs = [...formSteps[currentStep].querySelectorAll(":input")];
    const allValid = inputs.some(input => input.checkValidity());
    if (allValid) {
        currentStep += incrementor;
        showCurrentStep();
    };

    showCurrentStep();
});

function showCurrentStep() {
    formSteps.forEach((step, index) => {
        step.classList.toggle("active", index === currentStep)
    })
};
console.log(currentStep);