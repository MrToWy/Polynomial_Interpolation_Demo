export function calculateOffset (domElement) {
  const currOffset = {
    x: 0,
    y: 0
  };
  let newOffset = {
    x: 0,
    y: 0
  };

  if (domElement !== null) {

    if (domElement.scrollLeft) {
      currOffset.x = domElement.scrollLeft;
    }

    if (domElement.scrollTop) {
      //currOffset.y = domElement.scrollTop;  canvas is fixed now and will not scroll
    }

    if (domElement.offsetLeft) {
      currOffset.x -= domElement.offsetLeft;
    }

    if (domElement.offsetTop) {
      currOffset.y -= domElement.offsetTop;
    }

    if (domElement.parentNode !== undefined) {
      newOffset = calculateOffset(domElement.parentNode);
    }

    currOffset.x = currOffset.x + newOffset.x;
    currOffset.y = currOffset.y + newOffset.y;
  }
  return currOffset;
}
