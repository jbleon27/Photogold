const requiredInputs = document.querySelectorAll('[required]');
const postalCodePattern = /^\d{2}-\d{3}$/;
const stringPattern = /^[a-zA-ZąćęłńóśźżĄĘŁŃÓŚŹŻ]+(?:[\s-][a-zA-ZąćęłńóśźżĄĘŁŃÓŚŹŻ]+)*$/i;
const adressPattern = /^[\d\s{1}]*(\w{1,})(\s{1}?\w{1,})+/i;
const mailPattern = /^[0-9a-zA-Z_.-]+@[0-9a-zA-Z.-]+\.[a-zA-Z]{2,3}$/i;
const nipPattern = /^\d{3}-?\d{3}-?\d{2}-?\d{2}$/;


const showFieldValidation = (input, inputIsValid) => {
    if (inputIsValid == false) {
        input.classList.add('validate-warning');
        if (input.nextElementSibling !== null) {
            input.nextElementSibling.classList.add('visible');
        }
    } else {
        input.classList.remove('validate-warning');
        if (input.nextElementSibling !== null) {
            input.nextElementSibling.classList.remove('visible');
        }
    }
}

const validateInput = (input, reg) => {
    let inputIsValid = true;
    if(reg !== undefined) {
        if (!reg.test(input.value) || input.value === '') {
            inputIsValid = false;
        }
    } else {
        if(input.value === '')
        inputIsValid = false;
    }
    if (inputIsValid) {
        showFieldValidation(input, true);
        return true;
    } else {
        showFieldValidation(input, false);
        return false;
    }
}

const validateInputRadio = (input) => {
    const name = input.getAttribute('name');
    const group = document.querySelectorAll('input[name="' + name + '"]:checked');
    console.log(input.value);
    if (group.length) {
        showFieldValidation(input, true);
        return true;
    } else {
        showFieldValidation(input, false);
        return false;
    }
}

const showSavingDate = () => {
    let date = new Date();
    let minutes = date.getMinutes().toString().length == 1 ? `0${date.getMinutes()}` : date.getMinutes(),
        hour = date.getHours().toString().length == 1 ? `0${date.getHours()}` : date.getHours(),
        month = date.getMonth().toString().length == 1 ? `0${date.getMonth()}` : date.getMonth(),
        day = date.getDate().toString().length == 1 ? `0${date.getDate()}` : date.getDate(),
        year = date.getFullYear();
    document.querySelector('.saveData').innerHTML = `Last modified: ${day}.${month}.${year}, ${hour}:${minutes}`;
}


const saveToLocalStorage = (input) => {
    showSavingDate();
    if (input.type == 'radio') {
        if (input.checked) {
            localStorage.setItem('checkedInput', input.getAttribute('id'));
        }
    } else {
        localStorage.setItem(input.name, input.value);
    }
}

const loadFromLocalStorage = () => {
    showSavingDate();
    [...requiredInputs].forEach(input => {
        const inputValue = localStorage.getItem(input.name);
        const inputChecked = localStorage.getItem('checkedInput');
        input.value = inputValue;
        if (input.type == 'radio') {
            input.getAttribute('id') == inputChecked ? input.checked = true : input.checked = false;
        }
    })
}


const validateForm = () => {
    [...requiredInputs].forEach(input => {
        if (input.nodeName.toLowerCase() === 'input') {
            const inputType = input.type.toLowerCase();
            const inputName = input.name;

            input.addEventListener('input', () => {
                saveToLocalStorage(event.target);
            })
            if (inputType == 'text' && !inputName.includes('Adress') && !inputName.includes('PostCode') &&                          !inputName.includes('nip') && !inputName.includes('companyName')) {
                input.addEventListener('input', (event) => {
                    validateInput(event.target, stringPattern);
                })
            }
            if (inputType == 'email') {
                input.addEventListener('input', (event) => {
                    validateInput(event.target, mailPattern)
                })
            }
            if (inputType == 'radio') {
                input.addEventListener('click', (event) => {
                    console.log(event.target.value)
                    validateInputRadio(event.target)
                })
            }
            if (inputName == 'companyPostCode' || inputName == 'clientPostCode') {
                input.addEventListener('input', (event) => {
                    validateInput(event.target, postalCodePattern)
                })
            }
            if (inputName == 'companyName') {
                input.addEventListener('input', (event) => {
                    validateInput(event.target, undefined)
                })
            }
            if (inputName == 'clientAdress' || inputName == 'companyAdress') {
                input.addEventListener('input', (event) => {
                    validateInput(event.target, adressPattern)
                })
            }
            if (inputName == 'nipNumber') {
                input.addEventListener('input', (event) => {
                    validateInput(event.target, nipPattern)
                })
            }
        }
    })
}

const checkFormbeforeSending = (event) => {
    event.preventDefault();
    let formIsCorrect = true;
    [...requiredInputs].forEach(input => {
        if (input.nodeName.toLowerCase() === 'input') {
            const inputType = input.type.toLowerCase();
            const inputName = input.name;
            if (inputType == 'text' && !inputName.includes('Adress') && !inputName.includes('PostCode') && !inputName.includes('nip') && validateInput(input, stringPattern) == false) {
                formIsCorrect = false;
            }
            if (inputType == 'email' && validateInput(input, mailPattern) == false) {
                formIsCorrect = false;
            }
            if (inputType == 'radio' && validateInputRadio(input) == false) {
                console.log(validateInputRadio(input))
                formIsCorrect = false;
            }
            if ((inputName == 'companyPostCode' || inputName == 'clientPostCode') && validateInput(input, postalCodePattern) == false) {
                formIsCorrect = false;
            }
            if ((inputName == 'clientAdress' || inputName == 'companyAdress') && validateInput(input, adressPattern) == false) {
                formIsCorrect = false;
            }
            if (inputName == 'nipNumber' && validateInput(input, nipPattern) == false) {
                formIsCorrect = false;
            }
        }
    })
    if (formIsCorrect) {
        event.target.submit()
    } else {
        return false;
    }
}


document.querySelector('.form').addEventListener('submit', (event) => {
    checkFormbeforeSending(event);
})

document.addEventListener("DOMContentLoaded", () => {
    validateForm();
    loadFromLocalStorage()
})