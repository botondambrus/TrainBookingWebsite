function deleteTrain(trainId) {
  fetch(`/train/deleteTrain/${trainId}`, {
    method: 'DELETE',
  })
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        const trainRow = document.getElementById(`trainRow${trainId}`);
        trainRow.style.display = 'none';
      } else {
        throw new Error('There was a problem deleting the train!');
      }
    })
    .catch((error) => {
      console.error(error);
      alert('An error occurred while deleting the train!');
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const deleteTrainButtons = document.getElementsByClassName('deleteFlightButton');
  Array.from(deleteTrainButtons).forEach((button) => {
    button.addEventListener('click', () => {
      const trainId = button.getAttribute('data-train-id');
      deleteTrain(trainId);
    });
  });
});
