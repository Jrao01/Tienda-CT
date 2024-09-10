document.addEventListener('keyup',e=>{

if(e.target.matches('#buscador')){
    document.querySelectorAll('.prod').forEach(prod=>{
        prod.textContent.toLowerCase().includes(e.target.value)
        ? prod.classList.remove('filtro')
        : prod.classList.add('filtro')
    })
}


})