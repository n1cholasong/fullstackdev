const multiStepForm = document.querySelector("[data-multi-step]")
const formSteps = [...multiStepForm.querySelectorAll("[data-step]")]
let currentStep = formSteps.findIndex(step => {
    return step.classList.contains("active")
})

if (currentStep < 0) {
    currentStep = 0
    formSteps[currentStep].classList.add("active");
}

multiStepForm.addEventListener("click", e => {
    let incrementor
    if (e.target.matches("[data-next]")) {
        incrementor = 1
    } else if (e.target.matches("[data-back]")) {
        incrementor = -1
    } 

    if (incrementor == null) return

    const inputs = [...formSteps[currentStep].querySelectorAll("input, select")];
    const allValid = inputs.every(input => input.reportValidity())
    console.log(inputs)
    if (allValid) {
        currentStep += incrementor
        showCurrentStep()
    };

    showCurrentStep()
})

function showCurrentStep() {
    formSteps.forEach((step, index) => {
        step.classList.toggle("active", index === currentStep)
    })
}