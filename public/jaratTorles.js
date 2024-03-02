function jaratTorles(jaratId) {
  fetch(`/api/jaratTorles/${jaratId}`, {
    method: 'DELETE',
  })
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        const jaratSor = document.getElementById(`jaratSor${jaratId}`);
        jaratSor.style.display = 'none';
      } else {
        throw new Error('Probléma történt a törlés során!');
      }
    })
    .catch((error) => {
      console.error(error);
      alert('Hiba történt a törlés során!');
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const jaratTorlesButtons = document.getElementsByClassName('jaratTorlesButton');
  Array.from(jaratTorlesButtons).forEach((button) => {
    button.addEventListener('click', () => {
      const jaratId = button.getAttribute('data-jarat-id');
      jaratTorles(jaratId);
    });
  });
});
