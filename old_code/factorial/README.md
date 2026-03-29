This is a **Big Factorial Calculator**. Specifically, it calculates $n!$ (n-factorial) using a highly efficient **Mixed-Radix** (or "Base-10^k") approach.

Instead of storing one digit per array element, this one packs multiple digits into each integer to make it run much faster.
I know this is not the best approach but it was the best I could come up with on my own 6 years ago.

---

### Compile and Run

```bash
gcc -std=c11 chunked_factorial.c -lm && ./a.out
```
Using `-lm` is necessary in linux since this code uses math functions

---

### How it Works (The "Big Brain" Logic)

#### 1. Predicting the Future (Logarithms)
Before it starts multiplying, it uses math to figure out exactly how much memory it needs:
* **`log10(i)`**: The sum of the logarithms of all numbers from 1 to $n$ tells you exactly how many digits the final answer will have.
* **`ASIZE`**: It calculates the array size based on this prediction so it doesn't waste a single byte of memory.

#### 2. Packing Digits (`PBASE`)
This is the most clever part. This code uses **Base $10^{PSIZE}$**.
* If you enter a small number, it might store 7 or 8 digits in a single `int`.
* It treats `R[i]` as a single "super-digit."

#### 3. The Multiplication Loop
It performs $2 \times 3 \times 4 \dots \times n$. 
For each number `x`, it multiplies `x` by the "super-digit" in `R[i]`, adds the carry, and then splits the result using `% PBASE` and `/ PBASE`.

#### 4. Formatting the Output
Because each cell in the array (except the first one) represents exactly `PSIZE` digits, it uses a special `printf` trick:
* **`printf("%0*d ", PSIZE, R[j]);`**: This ensures that if a cell contains the number `7` but `PSIZE` is 5, it prints `00007` instead of just `7`. Without this, the middle of your large number would be missing all its zeros!

---

### Disclaimer

This description is partially generated with LLM since I wrote the code a long time ago and didn't do proper documentation back then.
