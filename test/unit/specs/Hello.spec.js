import { expect } from 'chai'
describe('toUpperCase', () => {
  it('should convert string to upper case', () => {
    expect([1, 2, 3, 4, 5, 6].map(value => {
      return value + 'hello'
    }), ['1hello', '2hello', '3hello', '4hello', '5hello', '6hello'])
  })
})
