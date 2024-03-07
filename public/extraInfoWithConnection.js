function loadExtraInfoWithTransfer(trainId) {
  const extraInfoTable = document.getElementById(`extraInfoWithTransfer${trainId}`);

  if (extraInfoTable.style.display === 'none') {
    extraInfoTable.style.display = 'table-row';
  } else {
    extraInfoTable.style.display = 'none';
  }
}

function hideExtraInfoWithTransfer(trainId) {
  const extraInfoTable = document.getElementById(`extraInfoWithTransfe${trainId}`);
  extraInfoTable.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  const extraInfoButtons = document.getElementsByClassName('extraInfoButtonWithTransfer');
  Array.from(extraInfoButtons).forEach((button) => {
    const trainId = button.getAttribute('data-train-id');
    button.addEventListener('click', () => {
      loadExtraInfoWithTransfer(trainId);
    });
  });

  const extraInfoCloseButtons = document.getElementsByClassName('extraInfoCloseButtonWithTransfer');
  Array.from(extraInfoCloseButtons).forEach((button) => {
    const trainId = button.getAttribute('data-train-id');
    button.addEventListener('click', () => {
      hideExtraInfoWithTransfer(trainId);
    });
  });
});
