(function () {
  let activeTabs = null;
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    activeTabs = tabs;
  })

  function send (type, content) {
    chrome.tabs.sendMessage(activeTabs[0].id, {
      type,
      content
    });
  } 

  const switches = document.querySelectorAll('.tools__switch');
  for (const switchElement of switches) {
    let on = false
    switchElement.addEventListener('click', function () {
      on = !on
      this.classList.toggle('tools__switch--active');
      const { filter } = this.dataset
      send('filter', {
        filter,
        on
      })
    })
  }
})()