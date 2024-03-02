function foglalasTorles(foglalasId) {
  fetch(`/api/foglalasTorles/${foglalasId}`, {
    method: 'DELETE',
  })
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        const foglalasSor = document.getElementById(`foglalasSor${foglalasId}`);
        foglalasSor.style.display = 'none';
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
  const foglalasTorlesButtons = document.getElementsByClassName('foglalasTorlesButton');
  Array.from(foglalasTorlesButtons).forEach((button) => {
    button.addEventListener('click', () => {
      const foglalasId = button.getAttribute('data-foglalas-id');
      foglalasTorles(foglalasId);
    });
  });
});
