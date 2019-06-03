(function () {
  let activeTabs = null
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    activeTabs = tabs
    updateState()
  })

  function send (type, content) {
    chrome.tabs.sendMessage(activeTabs[0].id, {
      type,
      content
    })
  }

  const switches = document.querySelectorAll('.tools__switch')
  for (const switchElement of switches) {
    switchElement.addEventListener('click', () => {
      switchElement.classList.toggle('tools__switch--active')
      updateState()      
    })
  }

  function applyInitialState () {
    for (const switchElement of switches) {
      const { filter } = switchElement.dataset
      const on = getState(filter) || false

      if (on) {
        switchElement.classList.add('tools__switch--active')
      } else {
        switchElement.classList.remove('tools__switch--active')
      }
    }
  }

  function updateState () {
    for (const switchElement of switches) {
      const { filter } = switchElement.dataset
      const on = switchElement.classList.contains('tools__switch--active')
      setState(filter, on)
      send('filter', { filter, on })
    }
  }

  applyInitialState()

  function setState (key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  function getState (key) {
    return JSON.parse(window.localStorage.getItem(key))
  }

  // Infos
  const infos = document.querySelector('.overlay__info')
  const infosButton = document.querySelector('.header__infos')
  infosButton.addEventListener('click', () => {
    infos.classList.toggle('overlay--show')
  })

  infos.addEventListener('click', () => {
    infos.classList.toggle('overlay--show')
  })

  // Modal
  const modalButton = document.querySelector('.tools__visualize')
  modalButton.addEventListener('click', () => {
    send('modal')
  })
})()