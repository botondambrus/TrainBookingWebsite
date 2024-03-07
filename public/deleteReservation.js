function deleteReservation(reservationId) {
  fetch(`/api/deleteReservation/${reservationId}`, {
    method: 'DELETE',
  })
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        const reservationRow = document.getElementById(`reservationRow${reservationId}`);
        reservationRow.style.display = 'none';
      } else {
        throw new Error('Problem occurred while deleting!');
      }
    })
    .catch((error) => {
      console.error(error);
      alert('Error occurred while deleting!');
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const deleteReservationButtons = document.getElementsByClassName('deleteReservationButton');
  Array.from(deleteReservationButtons).forEach((button) => {
    button.addEventListener('click', () => {
      const reservationId = button.getAttribute('data-reservation-id');
      deleteReservation(reservationId);
    });
  });
});
