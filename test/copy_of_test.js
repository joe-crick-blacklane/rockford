function test4(blah) {
  pre(typeof blah === 'number');
  const blop = blah + 1;
  post(blop === blah + 1);
  return blop;
}

const blah = function() {
  pre()
  post()
}

function test3(blah) {
  pre(typeof blah === 'number');
  const blop = blah + 1;
  pre(typeof blah === 'number');
  return blop;
}