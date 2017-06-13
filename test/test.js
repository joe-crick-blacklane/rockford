function test(blah) {
  pre(typeof blah === 'number');
  const blop = blah + 1;
  post(blop === blah + 1);
  return blop;
}