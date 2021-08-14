function smoothScrollArrow() {
  document.querySelector('.down-arrow').addEventListener(
    'click',
    function (event) {
      // Scroll to a certain element
      document.querySelector('.white-on-black').scrollIntoView({
        behavior: 'smooth'
      });
    },
    false
  );
}

export default smoothScrollArrow;
