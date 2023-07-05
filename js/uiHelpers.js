export function addCardClickListener(scene, number) {
  document.getElementById('upper-card'+ number)?.addEventListener( 'click', () => {
    clearActiveClass();
    document.getElementById("card" + number).classList.toggle('active');
    scene.step = number;
  });

  document.getElementById('upper-arrowCard'+ number)?.addEventListener( 'click', () => {
    clearActiveClass();
    document.getElementById("arrowCard" + number).classList.toggle('active');
    scene.step = number;
  });
}

function clearActiveClass() {
    Array.from(document.querySelectorAll('.collapse')).forEach(
      (el) => el.classList.remove('active')
    );
}

