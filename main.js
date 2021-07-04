function log(content) {
  console.log(content)
}

// Modulo not giving negative results.
// See https://stackoverflow.com/q/4467539/1336843.
function mod(n, m) {
  return ((n % m) + m) % m
}

// aplicar las reglas CSS definidas en el objeto style al elemento
function css(element, style) {
  for (const prop in style) {
    element.style[prop] = style[prop]
  }
}

class Dado {
  constructor({elem}) {

    this.elemDOM = elem
    this.lados = {}

    // Obtener los elementos DOM de cada CARA del dado.
    const lados = {
      frente: elem.querySelector(".frente"),
      atras: elem.querySelector(".atras"),
      derecha: elem.querySelector(".derecha"),
      izquierda: elem.querySelector(".izquierda"),
      arriba: elem.querySelector(".arriba"),
      abajo: elem.querySelector(".abajo")
    }

    // Establecer la ubicacion de los puntos de cada cara del
    // dado con CSS dependiendo del valor que tenga su lado.
    for (const nombreLado in lados) {
      const lado = lados[nombreLado]

      const punto1 = lado.querySelector(".punto1")
      const punto2 = lado.querySelector(".punto2")
      const punto3 = lado.querySelector(".punto3")
      const punto4 = lado.querySelector(".punto4")
      const punto5 = lado.querySelector(".punto5")
      const punto6 = lado.querySelector(".punto6")

      // Se establece el valor del lado.
      const valor = lado.children.length
      this.lados[nombreLado] = valor

      // Se agregan las clases CSS dependiendo del valor del lado.
      switch (valor) {
        case 1:
          lado.classList.add("uno")
          break
        case 2:
          lado.classList.add("dos")
          break
        case 3:
          lado.classList.add("tres")
          break
        case 4:
          lado.classList.add("cuatro")
          break
        case 5:
          lado.classList.add("cinco")
          break
        case 6:
          lado.classList.add("seis")
          break
      }
    }
  }
  lanzar() {
    const random = () => {
      const min = 1
      const max = 24
      return (Math.floor(Math.random() * (max-min)) + min) * 90
    }
    let rotacionEjeX = random()
    let rotacionEjeY = random()

    let rotacionPreviaEjeX = 0
    let rotacionPreviaEjeY = 0
    let cssTransform = this.elemDOM.style.transform

    // Obtener el valor de rotacion previo si lo tiene.
    if (cssTransform) {
      let xIdx1 = cssTransform.indexOf("(") + 1
      const xIdx2 = cssTransform.indexOf("deg")
      rotacionPreviaEjeX = Number(cssTransform.substring(xIdx1, xIdx2))
      const yIdx1 = cssTransform.lastIndexOf("(") + 1
      const yIdx2 = cssTransform.lastIndexOf("deg")
      rotacionPreviaEjeY = Number(cssTransform.substring(yIdx1, yIdx2))
    }
    cssTransform = `rotateX(${rotacionEjeX}deg) rotateY(${rotacionEjeY}deg)`

    this.elemDOM.style.webkitTransform = cssTransform
    this.elemDOM.style.transform = cssTransform

    return this.frente(rotacionEjeX, rotacionEjeY)
  }
  frente(rotacionX, rotacionY) {
    const { abajo, arriba, frente, izquierda, atras, derecha } = this.lados
    // Calcular los cambios verticales (hacia arriba).
    let cambiosY = mod(rotacionX / 90, 4)
    if (cambiosY === 1) {
      // Lado de abajo
      return abajo
    }
    if (cambiosY === 3) {
      // Lado de arriba
      return arriba
    }
    // Calcular los cambios horizontales (hacia la derecha).
    // Agregamos la cantidad de cambios verticales para corregir el dado en caso
    // de que sea una rotación de 180 grados (2 cambios hacia la derecha).
    // Puede ser 0 (rotación nula; se queda igual) o 2 (rotación de 180; queda
    // el de atrás).
    let cambiosX = mod(rotacionY / 90 + cambiosY, 4);
    // Orden de las caras hacia la izquierda.
    return [
      frente,
      izquierda,
      atras,
      derecha
    ][cambiosX];
  }
}

class Juego {
  constructor({dadosDOM, btnDOM, consolaDOM}) {
    const dados = []
    dadosDOM.forEach(elem => {
      // Crear Dado.
      dados.push(new Dado({elem}))
    })
    this.dados = dados
    this.consola = consolaDOM
    this.btn = btnDOM
    this._lanzando = false
  }
  jugar() {
    const j = this
    j._lanzando = true
    const className = "deshabilitado"
    j.btn.classList.add(className)
    setTimeout(
      () => {
        j._lanzando = false
        j.btn.classList.remove(className)
      },
      6000
    )
    return this.dados.map(dado => dado.lanzar())
  }
  get lanzando() {
    return this._lanzando
  }
  mostrarResultado(resultado) {
    this.consola.classList.remove("hide")
    // this.consola.innerHTML = resultado
    const resultadoDOM = document.createElement("p")
    resultadoDOM.innerText = JSON.stringify(resultado)
    this.consola.append(resultadoDOM)
  }
}

const dadosDOM = document.querySelectorAll(".dado")
const consolaDOM = document.querySelector(".consola")
const btnDOM = document.querySelector("button.jugar")

const j = new Juego({dadosDOM, btnDOM, consolaDOM})

btnDOM.onclick = () => {
  if (j.lanzando) return
  j.mostrarResultado(j.jugar())
}
