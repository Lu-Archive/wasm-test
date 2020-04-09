// math.c

int addAll(int x, int y)
{
	int res = 0;
	for (int a = x; a <= y; a = a + 1)
	{
		res = res + 1;
	}
	return res;
}

int square(int x)
{
	return x * x;
}