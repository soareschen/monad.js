/*
 * Nothing do not contain any state.
 * So for simplicity we implement it
 * as singleton object.
 */
var nothing = {
  type: 'Nothing',
  bind: (f) => nothing
}

var just = x => ({
  type: 'Just',
  value: x,
  bind: (f) => f(x)
})

var unit = x => just(x)

/*
 * Generator wrapper to simulate  
 * `do` in Haskell. The wrapper only
 * works if the monad bind method
 * only call callback once.
 *
 * It wouldn't work for instance on
 * List monad, I think.
 */
var runDo = (gen, x) => {
  var { done, value } = gen.next(x)
  if(done) return value

  return value.bind(x =>
    runDo(gen, x))
}

var doGen = (f, mx) =>
  mx.bind(x =>
    runDo(f(x)))

/*
 * Simple testing
 */
console.log('callback style:')

just('Hello')
.bind(greet =>
  just(greet + ', John')
  .bind(result => {
    console.log(result)
    return nothing
    .bind(x => {
      throw new Error('should not reach')
    })
  }))

console.log('generator style:')

doGen(function*(greet) {
  var result = yield just(greet + ', John')
  console.log(result)

  yield nothing

  throw new Error('should not reach')

}, just('Hello'))