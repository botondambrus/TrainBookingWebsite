function loadExtraInfo(jaratId) {
  const extraInfoTable = document.getElementById(`extraInfo${jaratId}`);
  const extraInfoAr = document.getElementById(`extraInfoAr${jaratId}`);
  const extraInfoTipus = document.getElementById(`extraInfoTipus${jaratId}`);

  if (extraInfoTable.style.display === 'none') {
    fetch(`/api/${jaratId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((jarat) => {
        if (jarat) {
          extraInfoTable.style.display = 'table-row';
          extraInfoAr.innerText = jarat.ar;
          extraInfoTipus.innerText = jarat.tipus;
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Hiba a járat lekérdezésekor!');
      });
  } else {
    extraInfoTable.style.display = 'none';
  }
}

function hideExtraInfo(jaratId) {
  const extraInfoTable = document.getElementById(`extraInfo${jaratId}`);
  extraInfoTable.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  const extraInfoButtons = document.getElementsByClassName('extraInfoButton');
  Array.from(extraInfoButtons).forEach((button) => {
    const jaratId = button.getAttribute('data-jarat-id');
    button.addEventListener('click', () => {
      loadExtraInfo(jaratId);
    });
  });

  const extraInfoCloseButtons = document.getElementsByClassName('extraInfoCloseButton');
  Array.from(extraInfoCloseButtons).forEach((button) => {
    const jaratId = button.getAttribute('data-jarat-id');
    button.addEventListener('click', () => {
      hideExtraInfo(jaratId);
    });
  });
});
