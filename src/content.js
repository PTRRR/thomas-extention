import wordLists from '../static/word-lists'

function createModalElement () {
  const { body } =  document
  const modal = document.createElement('div')
  modal.classList.add('words-modal')
  body.appendChild(modal)

  const words = document.querySelectorAll('.word')
  console.log(words.length)
  for (const [key, list] of Object.entries(wordLists)) {
    const elements = document.querySelectorAll(`.word--${key}`)

    if (elements.length > 0) {
      const section = document.createElement('div')
      section.classList.add('words-modal__section')
      section.classList.add(`words-modal--${key}`)
      section.style.width = `${elements.length / words.length * 100}%`
      modal.appendChild(section)
    }
  }
} 

function updateDOM () {
  const elements = document.querySelectorAll('p, span, h1, h2, h3, h4');
  
  // Extract all #text nodes
  const flatElements = []
  for (const element of elements) {
    tranverseChilds(element, element => {
      if (element.childNodes || element.childNodes.length === 0) {
        const { innerHTML } = element

        // Only take elements that don't have any HTML (#text)
        if (!innerHTML) {
          const wrappedTextNode = wrapTextNode(element)
          flatElements.push(wrappedTextNode)
        }
      }
    })
  }

  // Update all the #text nodes of the DOM by adding some custom elements
  // and classes
  for (const element of flatElements) {
    for (const [key, list] of Object.entries(wordLists)) {
      for (const word of list) {
        const content = element.innerHTML
        element.innerHTML = getTransformedContent(key, word, content)
      }
    }
  }
}

function wrapTextNode (textNode) {
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
    `<span class="word word--${key}">
      <span class="word__inner">
        ${word}
      </span>
    </span>`.trim()
  )
}

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
    
    case 'modal':
      const { body } = document
      body.classList.toggle('no-scroll');
      
      const modal = document.querySelector('.words-modal')
      modal.classList.toggle('words-modal--show')
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

function tranverseChilds (element, callback) {
  if (!!element.innerHTML) {
    const { childNodes } = element
    for (const child of childNodes) {
      callback(child)
      tranverseChilds(child, callback)
    }
  }
}

updateDOM()
createModalElement()

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(message => {
  handleMessage(message)
})