import wordLists from '../static/word-lists'

function updateDOM () {
  const elements = document.querySelectorAll('p, span, h1, h2, h3, h4');
  const flatElements = []
  for (const element of elements) {
    tranverseElement(element, element => {
      if (element.childNodes || element.childNodes.length === 0) {
        const { innerHTML } = element
        if (!innerHTML) {
          const wrappedTextNode = wrapTextNode(element)
          flatElements.push(wrappedTextNode)
        }
      }
    })
  }

  for (const element of flatElements) {
    for (const [key, list] of Object.entries(wordLists)) {
      for (const word of list) {
        const content = element.innerHTML
        element.innerHTML = getTransformedContent(key, word, content)
      }
    }
  }
}

function wrapTextNode(textNode) {
  var spanNode = document.createElement('span');
  var newTextNode = document.createTextNode(textNode.textContent);
  spanNode.appendChild(newTextNode);
  textNode.parentNode.replaceChild(spanNode, textNode);
  return spanNode;
}

function getTransformedContent (key, word, content) {
  const regex = new RegExp(`\\b${word}\\b`, 'gi')
  return content.replace(
    regex,
    `<span class="word word--${key}"><span class="word__inner" style="display: block">${word}</span></span>`
    )
}

chrome.runtime.onMessage.addListener(message => {
  handleMessage(message)
})

const state = {
  ecological: false,
  social: false,
  projection: false,
  mathematical: false,
  'pol-eco': false
}

function handleMessage(message) {
  const { type, content } = message
  switch (type) {
    case 'filter':
      updateState(content)
      applyState()
      break;
  }
}

function updateState ({ filter, on }) {
  state[filter] = on
}

function applyState () {
  for (const key of Object.keys(wordLists)) {
    const words = document.querySelectorAll(`.word--${key}`)
    words.forEach(it => {
      if (state[key]) {
        it.classList.add('word--active')
      } else {
        it.classList.remove('word--active')
      }
    })
  }
}

function tranverseElement (element, callback) {
  if (!!element.innerHTML) {
    const { childNodes } = element
    for (const child of childNodes) {
      callback(child)
      tranverseElement(child, callback)
    }
  }
}

updateDOM();