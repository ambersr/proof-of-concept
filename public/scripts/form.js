if ('fetch' in window && 'DOMParser' in window) {

document.addEventListener('submit', async function (event) {
    const form = event.target

    if (!form.hasAttribute('data-enhanced')) {
        return
    }

    event.preventDefault()

    const contactForm = form.querySelector('.loading');
        if (loadingDiv) {
            contactForm.classList.add('show');
        }
        
    const contentForm = form.querySelector('.form-content');
        if (contentForm) {
            contentForm.classList.add('hidden');
        }

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
