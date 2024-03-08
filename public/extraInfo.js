function loadExtraInfo(trainId) {
  const extraInfoTable = document.getElementById(`extraInfo${trainId}`);
  const extraInfoPrice = document.getElementById(`extraInfoPrice${trainId}`);
  const extraInfoType = document.getElementById(`extraInfoType${trainId}`);

  if (extraInfoTable.style.display === 'none') {
    fetch(`/train/${trainId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((train) => {
        if (train) {
          extraInfoTable.style.display = 'table-row';
          extraInfoPrice.innerText = train.price;
          extraInfoType.innerText = train.type;
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Error fetching train information!');
      });
  } else {
    extraInfoTable.style.display = 'none';
  }
}

function hideExtraInfo(trainId) {
  const extraInfoTable = document.getElementById(`extraInfo${trainId}`);
  extraInfoTable.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  const extraInfoButtons = document.getElementsByClassName('extraInfoButton');
  Array.from(extraInfoButtons).forEach((button) => {
    const trainId = button.getAttribute('data-train-id');
    button.addEventListener('click', () => {
      loadExtraInfo(trainId);
    });
  });

  const extraInfoCloseButtons = document.getElementsByClassName('extraInfoCloseButton');
  Array.from(extraInfoCloseButtons).forEach((button) => {
    const trainId = button.getAttribute('data-train-id');
    button.addEventListener('click', () => {
      hideExtraInfo(trainId);
    });
  });
});
