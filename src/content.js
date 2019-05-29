chrome.runtime.onMessage.addListener(message => {
  handleMessage(message)
})

function handleMessage(message) {
  const { type, content } = message
  switch (type) {
    case 'filter':
      const paragraphs = document.querySelectorAll('p');
      if (content === 'ecological') {
        for (const paragraph of paragraphs) {
          paragraph.style.color = 'green'
        }
      } else if (content === 'mathematical') {
        for (const paragraph of paragraphs) {
          paragraph.style.color = 'blue'
        }
      }
      break;
  }
}