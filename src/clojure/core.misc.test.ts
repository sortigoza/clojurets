import { clojure } from '../clojure';
import { forms } from '../forms';

const literal = forms.literal;

describe('Compare', function () {
  it('= should return true if just one argument is given', function () {
    expect(clojure.run('(= nil)')).toEqual(literal(true));
    expect(clojure.run('(= "test")')).toEqual(literal(true));
  });

  it('= should return true if primitives are equal', function () {
    expect(clojure.run('(= 1 1)')).toEqual(literal(true));
  });

  it('= should return false if primitives are not equal', function () {
    expect(clojure.run('(= 1 2)')).toEqual(literal(false));
  });

  it('= should return true if quoted lists are equal', function () {
    expect(clojure.run("(= '(1 2) '(1 2))")).toEqual(literal(true));
  });

  it('= should return false if quoted lists are not equal', function () {
    expect(clojure.run("(= '(1 2) '(3 4))")).toEqual(literal(false));
  });

  it('= should handle more than two arguments', function () {
    expect(clojure.run('(= 1 2 1 1)')).toEqual(literal(false));
  });

  it('= should handle equality between vectors and lists', function () {
    expect(clojure.run("(= [1 2 3] '(1 2 3))")).toEqual(literal(true));
    expect(clojure.run("(= [1 2 4] '(1 2 3))")).toEqual(literal(false));
    expect(clojure.run("(= [1 2 3 4] '(1 2 3))")).toEqual(literal(false));
  });

  it('= should handle nested lists', function () {
    expect(clojure.run("(= (list 1 '(2 3)) (list 1 '(2 3)))")).toEqual(literal(true));
    expect(clojure.run("(= (list 1 '(2 3)) (list 1 '(2 4)))")).toEqual(literal(false));
  });

  it('= should handle nested vectors', function () {
    expect(clojure.run('(= [1 [2 3]] [1 [2 3]])')).toEqual(literal(true));
    expect(clojure.run('(= [1 [2 3]] [1 [2 4]])')).toEqual(literal(false));
  });
});
