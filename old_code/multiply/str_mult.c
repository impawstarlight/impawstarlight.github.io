#include <stdio.h>
#include <string.h>
void reverse(char A[], int l)
{
	int i, j;
	char t;
	for (i = 0, j = l-1; i < l/2; i++, j--)
	{
		t = A[i];
		A[i] = A[j];
		A[j] = t;
	}
}

int main()
{
	// Declaration
	char P[1000], Q[1000];
	int lp, lq, lr;
	int i, j, k;
	
	// Initialization
	gets(P);
	gets(Q);
	lp = strlen(P);
	lq = strlen(Q);
	lr = lp+lq;
	
	// Modulation
	for (i = 0; i < lp || i < lq; i++)
	{
		if (i < lp)
			P[i] -= '0';
		if (i < lq)
			Q[i] -= '0';
	}
	
	reverse(P, lp);
	reverse(Q, lq);
	
	// Second Part
	char R[lr+1], T[lr], c, t;
	for (i = 0; i <= lr; i++)
		R[i] = 0;
	
	// Multiplication
	for (i = 0; i < lq; i++)
	{
		for (j = c = 0; j < lp; j++)
			T[j] = (t = Q[i]*P[j]+c) - (c = t/10)*10;
		T[j] = c;
		k = j+1;
		for (j = c = 0; j < k; j++)
			R[j+i] = (t = T[j]+R[j+i]+c) - (c = t/10)*10;
		R[j+i] += c;
	}
	
	// Demodulation
	if (R[lr-1] == 0)
		lr--;
	for (i = 0; i < lr; i++)
		R[i] += '0';
	reverse(R, lr);
	
	puts(R);
	return 0;
}
