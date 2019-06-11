const { body } = document

function getFileUrl (path) {
  return chrome.extension.getURL(path);
}

async function loadFonts () {
  const rima = new FontFace('Rima', `url(${getFileUrl('Rima-Book.otf')})`)
  document.fonts.add(await rima.load())
  const ripley = new FontFace('Ripley', `url(${getFileUrl('SCRipley-NewsAC.otf')})`)
  document.fonts.add(await ripley.load())
}

async function injectHTML () {
  const modals = ['infos.html', 'visualize.html']

  try {
    for (const modalFile of modals) {
      const data = await fetch(getFileUrl(modalFile))
      const html = await data.text()
      const modal = createElementFromHTML(html)
      body.appendChild(modal)

      modal.addEventListener('click', () => {
        const { className } = modal.dataset
        toggleModal(`${className}`)
      })
    }
  } catch (e) {
    console.error(e)
  }
}

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild; 
}

function updateVisualizeModal () {
  const modal = document.querySelector('.words-visualize main')

  const words = document.querySelectorAll('.word')
  for (const key of Object.keys(wordLists)) {
    const elements = document.querySelectorAll(`.word--${key}`)

    if (elements.length > 0) {
      const section = document.createElement('div')
      const infos = document.querySelector(`.fptp--${key} .fptp__info-words`)
      infos.innerHTML = `${elements.length} words (${(elements.length / words.length * 100).toFixed(2)}%)`
      section.classList.add('words-modal__section')
      section.classList.add(`words-modal--${key}`)
      section.style.width = `${elements.length / words.length * 100}%`
      modal.appendChild(section)
    }
  }
}

function toggleModal (modalClassName) {
  const modals = document.querySelectorAll('.words-modal')
  modals.forEach(modal => {
    if (!modal.classList.contains(modalClassName)) {
      modal.classList.remove('words-modal--show')
    } else {
      modal.classList.toggle('words-modal--show')
    }
  })

  const shownModals = document.querySelectorAll('.words-modal--show')
  if (shownModals.length > 0) {
    body.classList.add('no-scroll');
  } else {
    body.classList.remove('no-scroll');
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
    
    case 'visualize':
      toggleModal('words-visualize')
      break;

    case 'infos':
      toggleModal('words-infos')
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

async function init () {
  updateDOM()

  try {
    await loadFonts()
    await injectHTML()
  } catch (e) {
    console.error(e)
  }
  
  updateVisualizeModal()

  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener(message => {
    handleMessage(message)
  })
}

init()
