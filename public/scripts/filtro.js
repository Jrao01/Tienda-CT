const radios = document.querySelectorAll('input[type="radio"]');
/*
let cates = []
*/
let cates //

radios.forEach((radio) => {
    radio.addEventListener('change', (event) => {
        if (event.target.checked) {
            const valor = event.target.value.toLowerCase();
            //cates.push(valor)
            cates = valor//
            console.log(cates)

        } /*else {
            /*const deleteC = event.target.value.toLowerCase()
            cates = cates.filter(cate => cate !== deleteC)
            console.log(cates)
        }*/
        
        
        document.querySelectorAll('.prod').forEach(prod => {
            prod.textContent.toLowerCase().includes(cates,0)
                ? prod.classList.remove('filtro')
                : prod.classList.add('filtro')
        })

    });
});