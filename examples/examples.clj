;; data types

; number
1991

; string
"a-string"

; literal
nil
true
false

; vector
[]
[1 2]
[1 [2 [3]]]
[(+ 1 2) (* 2 3)]

; keyword
:a
:longer-keyword
::double-colon

; hash-map
{}
{:a 1 :b 2}
{:a {:b {:c 1}}}
[:a (+ 1 2) :b (* 2 3)]

; list
'(1 2)

; comment
; a-comment

; call
(+ 1 1)
(* 2 2)
(/ 8 2)

; symbol
(def a 1)
a
user/a
(defn add-one [n] (+ n 1))
add-one

;; procedures

; simple function
(defn add-two [n] (+ 2 n))
(add-two 8)

; function calling a function
(defn add-three [n] (+ 1 (add-two n)))
(add-three 7)

; conditional
(defn is-zero? [n]
  (if (= n 0)
    5
    10))
(is-zero? 0)

; recursive function
(defn fib [n]
  (cond
    (= n 0) 0
    (= n 1) 1
    :else (+ (fib (- n 1)) (fib (- n 2)))))
(fib 5)

(defn acc [n val]
  (if (= n 0) val (acc (- n 1) (+ 2 val))))
(acc 1 0)
