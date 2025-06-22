if ('fetch' in window && 'DOMParser' in window) {

document.addEventListener('submit', async function (event) {
    const form = event.target

    // als het formulier het data-enhanced=""
    if (!form.hasAttribute('data-enhanced')) {
        return
    }

    // voorkomt de refresh tijdens het submitten
    event.preventDefault()

    // als het formulier verzonden wordt laat dan de loading 
    const contactForm = form.querySelector('.loading');
    contactForm.classList.add('show');
    
    // als het formulier verzonden wordt hide dan alle formuliervelden
    const contentForm = form.querySelector('.form-content');
    contentForm.classList.add('hidden');

    const response = await fetch(form.action, {
        method: form.method,
        body: new URLSearchParams(new FormData(form)),
        redirect: 'follow'
    })

    const responseText = await response.text()

    const parser = new DOMParser()
    const responseDOM = parser.parseFromString(responseText, 'text/html')
    const newState = responseDOM.querySelector('[data-enhanced="' + form.getAttribute('data-enhanced') + '"]')

    form.outerHTML = newState.outerHTML
})
}
