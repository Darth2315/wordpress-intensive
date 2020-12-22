window.addEventListener('DOMContentLoaded', () => {
    
    const overlay = document.querySelector('.overlay'),
          modalForm = document.querySelector('#consultation'),
          modalThanks = document.querySelector('#thanks'),
          btns = document.querySelectorAll('[data-modal]'),
          close = document.querySelectorAll('.modal__close');

    function showModal(modal) {
        overlay.style.display = 'block';
        modal.style.display = 'block';
    }

    function closeModal(modal) {
        overlay.style.display = 'none';
        modal.style.display = 'none';
    }

    btns.forEach(item => {
        item.addEventListener('click', () => {
            showModal(modalForm);
        });
    });
    
    close.forEach(item => {
        item.addEventListener('click', () => {
            closeModal(modalForm);
            closeModal(modalThanks);
        });
    });

    overlay.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('overlay')) {
            closeModal(modalForm);
            closeModal(modalThanks);
        }
    });

    function closeModalByEscape(modal) {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && modal.style.display === 'block') {
                closeModal(modalForm);
                closeModal(modalThanks);
            }
        });
    }
    closeModalByEscape(modalForm);
    closeModalByEscape(modalThanks);

    // Send form data
    const inputs = document.querySelectorAll('input'),
          forms = document.querySelectorAll('form');

    const message = {
          loading: 'img/spinner.svg',
          success: "Отправка прошла успешно!",
          error: "Что-то пошло не так..."
    };

    const postData = async (url, data) => {
        let res = await fetch(url, {
            method: 'POST',
            body: data
        });
        return await res.text();
    };

    const clearInputs = () => {
        inputs.forEach(item => {
            item.value = '';
        });
    };
    
    forms.forEach(item => {
        item.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const spinner = document.createElement('img');
            spinner.src = message.loading;
            spinner.classList.add('modal__spinner');
            item.appendChild(spinner);

            const formData = new FormData(item);

            postData('server.php', formData)
            .then(res => {
                console.log(res);
                closeModal(modalForm);
                showModal(modalThanks);
            })
            .catch(() => modalThanks.textContent = message.error)
            .finally(() => {
                clearInputs();
                spinner.remove();
                setTimeout(() => {
                    closeModal(modalThanks);
                }, 5000);
            });
        });
    });

    // scroll
    const links = document.querySelectorAll('[href^="#"]'),
          upElem = document.querySelector('.pageup'),
          speed = 0.3;

    window.addEventListener('scroll', () => {
        if (document.documentElement.scrollTop > 1400) {
            upElem.classList.add('fadeIn');
            upElem.classList.remove('fadeOut');
            upElem.style.display = 'block';
        } else {
            upElem.style.display = 'none';
        }
    });

    links.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();

            let widthTop = document.documentElement.scrollTop,
                hash = this.hash,
                toBlock = document.querySelector(hash).getBoundingClientRect().top,
                start = null;

            requestAnimationFrame(step);

            function step(time) {
                if (start === null) {
                    start = time;
                }

                let progress = time - start,
                    r = (toBlock < 0 ? Math.max(widthTop - progress / speed, widthTop + toBlock) : Math.min(widthTop + progress / speed, widthTop + toBlock));

                document.documentElement.scrollTo(0, r);

                if (r != widthTop + toBlock) {
                    requestAnimationFrame(step);
                } else {
                    // location.hash = hash;
                }
            }
        });
    });
});