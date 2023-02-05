import request from "../index";

export async function loginRequest(
  account: string,
  password: string
): Promise<any> {
  const result = await request.post({
    url: "/login",
    data: {
      account,
      password,
    },
  });
  return result;
}
