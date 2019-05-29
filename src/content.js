import wordLists from '../static/word-lists'

function updateDOM () {
  const elements = document.querySelectorAll('p');
  const flatElements = []
  for (const element of elements) {
    tranverseElement(element, element => {
      if (element.childNodes || element.childNodes.length === 0) {
        const { innerHTML } = element
        if (!innerHTML) {
          // flatElements.push(element)
          console.log(element)
        }
      }
    })
  }

  for (const element of flatElements) {
    const words = element.textContent.split(' ')
    console.log(element.parentNode)
    // const newWords = []
    // for (const word of words) {
    //   newWords.push(getTransformedWord(word))
    // }

    // element.textContent = newWords.join(' ')
  }
}

function getTransformedWord (word) {
  for (const [key, list] of Object.entries(wordLists)) {
    const found = list.indexOf(word) > -1
    if (found) {
      return `<span class="word word--${key}"><span class="word__inner" style="display: block">${word}</span></span>`
    }
  }

  return word
}

chrome.runtime.onMessage.addListener(message => {
  handleMessage(message)
})

const state = {
  ecological: false,
  social: false,
  projection: false,
  methematical: false,
  'pol-eco': false
}

const wordClasses = [
  'word--ecological',
  'word--social',
  'word--projection',
  'word--mathematical',
  'word--pol-eco'
]

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
  const paragraphs = document.querySelectorAll('p');
  for (const [key, on] of Object.entries(state)) {
    for (const paragraph of paragraphs) {
      if (on) {
      } else {
        paragraph.classList.remove(`word--${key}`)
      }
    }
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