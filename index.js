import { getRandom } from "./utils.js"

const $parent = document.querySelector(".parent")
const $player = document.querySelector(".player")
const $player2 = document.querySelector(".player2")

const createElement = (tag, className) => {
  const $tag = document.createElement(tag)
  if (className) {
    if (Array.isArray(className)) {
      className.forEach(item => {
        $tag.classList.add(item)
      })
    } else {
      $tag.classList.add(className)
    }
  }

  return $tag
}

function createEmptyPlayerBlock() {
  const el = createElement("div", ["character", "div11", "disabled"])
  const img = createElement("img")
  img.src = "http://reactmarathon-api.herokuapp.com/assets/mk/avatar/11.png"
  el.appendChild(img)
  $parent.appendChild(el)
}

async function init() {
  localStorage.removeItem("player1")

  const players = await fetch(
    "https://reactmarathon-api.herokuapp.com/api/mk/players"
  ).then(res => res.json())

  let isCanSelect = true

  let imgSrc = null
  createEmptyPlayerBlock()

  players.forEach(item => {
    const el = createElement("div", ["character", `div${item.id}`])
    const img = createElement("img")

    const handleMouseMove = () => {
      if (imgSrc === null && isCanSelect) {
        imgSrc = item.img
        const $img = createElement("img")
        $img.src = imgSrc
        $player.appendChild($img)
      }
    }

    const handleMouseOut = () => {
      if (imgSrc && isCanSelect) {
        imgSrc = null
        $player.innerHTML = ""
      }
    }

    el.addEventListener("mousemove", handleMouseMove)

    el.addEventListener("mouseout", handleMouseOut)

    el.addEventListener("click", () => {
      //TODO: Мы кладем нашего игрока в localStorage что бы потом на арене его достать.
      // При помощи localStorage.getItem('player1'); т.к. в localStorage кладется строка,
      // то мы должны ее распарсить обратным методом JSON.parse(localStorage.getItem('player1'));
      // но это уже будет в нашем классе Game когда мы инициализируем игроков.
      //   el.removeEventListener('mousemove')
      $parent.style.pointerEvents = "none"
      isCanSelect = false
      //   el.removeEventListener("mousemove", handleMouseMove)
      //   el.removeEventListener("mouseout", handleMouseOut)
      localStorage.setItem("player1", JSON.stringify(item))

      el.classList.add("active")

      let imgSrcEnemy = null
      let $currentCharacterDiv = null
      let currentEnemyFighter = null

      let timerId = setInterval(() => {
        let randomFighter = players[getRandom(players.length - 1)]

        $currentCharacterDiv = document.querySelector(`div${randomFighter.id}`)
        currentEnemyFighter = randomFighter

        if (imgSrcEnemy === null && $currentCharacterDiv === null) {
          $currentCharacterDiv = document.querySelector(
            `.div${randomFighter.id}`
          )

          $currentCharacterDiv.classList.add("currentEnemy")

          imgSrcEnemy = randomFighter.img
          const $img = createElement("img")
          $img.src = imgSrcEnemy
          $player2.appendChild($img)
        }
      }, 1000)

      let timerId2 = setInterval(() => {
        if (imgSrcEnemy && $currentCharacterDiv) {
          $currentCharacterDiv.classList.remove("currentEnemy")
          imgSrcEnemy = null
          $player2.innerHTML = ""
        }
      }, 900)

      setTimeout(() => {
        // TODO: Здесь должен быть код который перенаправит вас на ваше игровое поле...
        //  Пример использования: window.location.pathname = 'arenas.html';
        clearInterval(timerId)
        clearInterval(timerId2)
        localStorage.setItem("player2", JSON.stringify(currentEnemyFighter))
        window.location.pathname = "arenas.html"
      }, 5000)
    })

    img.src = item.avatar
    img.alt = item.name

    el.appendChild(img)
    $parent.appendChild(el)
  })
}

init()
