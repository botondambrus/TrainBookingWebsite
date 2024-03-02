function loadExtraInfoAtszallas(jaratId) {
  const extraInfoTable = document.getElementById(`extraInfoAtszallas${jaratId}`);

  if (extraInfoTable.style.display === 'none') {
    extraInfoTable.style.display = 'table-row';
  } else {
    extraInfoTable.style.display = 'none';
  }
}

function hideExtraInfoAtszallas(jaratId) {
  const extraInfoTable = document.getElementById(`extraInfoAtszallas${jaratId}`);
  extraInfoTable.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  const extraInfoButtons = document.getElementsByClassName('extraInfoButtonAtszallas');
  Array.from(extraInfoButtons).forEach((button) => {
    const jaratId = button.getAttribute('data-jarat-id');
    button.addEventListener('click', () => {
      loadExtraInfoAtszallas(jaratId);
    });
  });

  const extraInfoCloseButtons = document.getElementsByClassName('extraInfoCloseButtonAtszallas');
  Array.from(extraInfoCloseButtons).forEach((button) => {
    const jaratId = button.getAttribute('data-jarat-id');
    button.addEventListener('click', () => {
      hideExtraInfoAtszallas(jaratId);
    });
  });
});
