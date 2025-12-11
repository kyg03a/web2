function validatePrecision(input, errorElementId) {
    let value = input.value.replace(',', '.');
    if (value.includes('.')) {
        let parts = value.split('.');
        if (parts[1] && parts[1].length > 3) {
            parts[1] = parts[1].substring(0, 3);
            input.value = parts[0] + '.' + parts[1];
        } else {
            input.value = value;
        }
    }

    if (errorElementId) {
        document.getElementById(errorElementId).textContent = '';
    }
}

function validateYPrecision(input) {
    validatePrecision(input, 'y-error');
}

function validateRPrecision(input) {
    validatePrecision(input, 'r-error');
}

const coordsForm = document.getElementById('coords-form');
if (coordsForm) {
    coordsForm.addEventListener('submit', function(event) {
        console.log("Обычная отправка формы");
    });
}

function initXButtons() {
    const xButtons = document.querySelectorAll('.x-button');
    if (xButtons.length === 0) return;

    xButtons.forEach(button => {
        button.addEventListener('click', function() {
            xButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            document.getElementById('hiddenX').value = this.getAttribute('data-value');
            document.getElementById('x-error').textContent = '';
        });
    });
}

function initFormValidation() {
    const form = document.getElementById('coords-form');
    if (!form) return;

    form.addEventListener('submit', function(event) {
        const xValue = document.getElementById('hiddenX').value;
        const yValue = document.getElementById('yInput').value;
        const rValue = document.getElementById('rInput').value;
        let isValid = true;

        document.getElementById('x-error').textContent = '';
        document.getElementById('y-error').textContent = '';
        document.getElementById('r-error').textContent = '';

        if (!xValue) {
            document.getElementById('x-error').textContent = 'Выберите значение X';
            isValid = false;
        }

        if (!yValue.trim()) {
            document.getElementById('y-error').textContent = 'Введите значение Y';
            isValid = false;
        } else {
            const yNum = parseFloat(yValue.replace(',', '.'));
            if (isNaN(yNum) || yNum < -5 || yNum > 5) {
                document.getElementById('y-error').textContent = 'Y должен быть числом от -5 до 5';
                isValid = false;
            }
        }

        if (!rValue.trim()) {
            document.getElementById('r-error').textContent = 'Введите значение R';
            isValid = false;
        } else {
            const rNum = parseFloat(rValue.replace(',', '.'));
            if (isNaN(rNum) || rNum < 1 || rNum > 4) {
                document.getElementById('r-error').textContent = 'R должен быть числом от 1 до 4';
                isValid = false;
            }
        }

        if (!isValid) {
            event.preventDefault();
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initXButtons();
    initFormValidation();

    const yInput = document.getElementById('yInput');
    const rInput = document.getElementById('rInput');

    if (typeof initCanvas === 'function') {
        let initialR = window.currentR || 2;
        if (rInput && rInput.value) {
            initialR = parseFloat(rInput.value) || initialR;
        }
        initCanvas(initialR);
    }

    if (yInput) {
        yInput.addEventListener('input', function() {
            validateYPrecision(this);
        });
    }

    if (rInput) {
        rInput.addEventListener('input', function() {
            validateRPrecision(this);
            const rValue = this.value;
            if (rValue && !isNaN(parseFloat(rValue))) {
                const R = parseFloat(rValue);
                window.currentR = R;
                if (typeof initCanvas === 'function') {
                    initCanvas(R);
                }
            }
        });

        rInput.addEventListener('change', function() {
            validateRPrecision(this);
            const rValue = this.value;
            if (rValue && !isNaN(parseFloat(rValue))) {
                const R = parseFloat(rValue);
                window.currentR = R;
                if (typeof initCanvas === 'function') {
                    initCanvas(R);
                }
            }
        });

        if (rInput.value && !isNaN(parseFloat(rInput.value))) {
            const R = parseFloat(rInput.value);
            if (typeof initCanvas === 'function') {
                initCanvas(R);
            }
        }
    }

    const showTableBtn = document.getElementById('showTableBtn');
    if (showTableBtn) {
        showTableBtn.addEventListener('click', function() {
            window.location.href = 'controller?showResults=true';
        });
    }
});
