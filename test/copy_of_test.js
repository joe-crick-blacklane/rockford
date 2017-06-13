function test4(blah) {
  pre(typeof blah === 'number');
  const blop = blah + 1;
  post(blop === blah + 1);
  return blop;
}

function test3(blah) {
  pre(typeof blah === 'number');
  const blop = blah + 1;
  pre(typeof blah === 'number');
  return blop;
}