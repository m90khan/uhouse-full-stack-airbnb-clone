interface Body<TVariables> {
  query: string;
  variables?: TVariables;
}
export const server = {
  fetch: async <TData = any, TVariables = any>(body: Body<TVariables>) => {
    const res = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    /*
    res.json() returns a value of promise but no option to pass the data type
    we are sure that data will be return so we assert that the return promise will
    have a data field that will be typed with TData
    */
    return res.json() as Promise<{ data: TData }>;
  },
};
