#include <stdio.h>
#include <math.h>

int main() {
    while (1) {
        printf("Enter an integer: ");
        int n;
        scanf("%d", &n);
        if (n < 0) { // exit on negative input
            puts("Exiting...");
            break;
        }

        const int NSIZE = 1+log10(n); // no of digits in n
        const int PSIZE = 9-NSIZE; // partition size, 9 = maximum digits that int can handle
        const int PBASE = pow(10, PSIZE);

        double digits = 1;
        // calculate no of digits in n factorial
        for (int i = 2; i <= n; i++)
            digits += log10(i);

        const int ASIZE = (digits + PSIZE - 1) / PSIZE; // size of the result array
        //printf("%d %d %d %lf\n", NSIZE, PSIZE, ASIZE, digits);


        int R[ASIZE];
        // set last cell as 1 and the rest as 0
        R[0] = 1;
        for (int i = 1; i < ASIZE; i++)
            R[i] = 0;

        // multiply cell by cell, starting from the last cell
        for (int x = 2; x <= n; x++) {
            int carry = 0;
            for (int i = 0; i < ASIZE; i++) {
                int y = x * R[i] + carry;
                R[i] = y % PBASE;
                carry = y / PBASE;
            }
        }


        int j = ASIZE-1;
        // print the leftmost cell without leading zeros
        printf("%d! = %d ", n, R[j]);
        while (j--) // print the rest with leading zeros
            printf("%0*d ", PSIZE, R[j]);

        printf(" (%d digits)\n\n", (int)digits);
    }

	return 0;
}
